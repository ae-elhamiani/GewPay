const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PaymentContract", function () {
  let ownerContract, merchantRegister, storeContract, paymentContract;
  let owner, merchant1, merchant2, customer, addr4;
  let erc20Token, unsupportedToken;
  const ZERO_ADDRESS = ethers.ZeroAddress;

  beforeEach(async function () {
    [owner, merchant1, merchant2, customer, addr4] = await ethers.getSigners();

    const OwnerContract = await ethers.getContractFactory("OwnerContract");
    ownerContract = await OwnerContract.deploy();

    const MerchantRegister = await ethers.getContractFactory("MerchantRegister");
    merchantRegister = await MerchantRegister.deploy(await ownerContract.getAddress());

    const StoreContract = await ethers.getContractFactory("StoreContract");
    storeContract = await StoreContract.deploy(await ownerContract.getAddress(), await merchantRegister.getAddress());

    const PaymentContract = await ethers.getContractFactory("PaymentContract");
    paymentContract = await PaymentContract.deploy(
      await ownerContract.getAddress(),
      await merchantRegister.getAddress(),
      await storeContract.getAddress()
    );

    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    erc20Token = await ERC20Mock.deploy("Test Token", "TST", customer.address, ethers.parseEther("1000"));
    unsupportedToken = await ERC20Mock.deploy("Unsupported Token", "UNS", customer.address, ethers.parseEther("1000"));

    // Register merchants
    await merchantRegister.connect(merchant1).registerMerchant();
    await merchantRegister.connect(merchant2).registerMerchant();

    // Add supported tokens
    await ownerContract.addTokens([await erc20Token.getAddress(), ZERO_ADDRESS]);

    // Create stores
    await storeContract.connect(merchant1).createStore([await erc20Token.getAddress(), ZERO_ADDRESS]);
    await storeContract.connect(merchant2).createStore([await erc20Token.getAddress(), ZERO_ADDRESS]);
  });

  describe("Contract Initialization", function () {
    it("Should set the correct owner, merchant register, and store contract addresses", async function () {
      expect(await paymentContract.ownerContract()).to.equal(await ownerContract.getAddress());
      expect(await paymentContract.merchantRegister()).to.equal(await merchantRegister.getAddress());
      expect(await paymentContract.storeContract()).to.equal(await storeContract.getAddress());
    });

    it("Should set the correct constants", async function () {
      expect(await paymentContract.FEE_PERCENTAGE()).to.equal(5);
      expect(await paymentContract.BASIC_PLAN_TRANSACTION_LIMIT()).to.equal(20);
      expect(await paymentContract.BASIC_PLAN_VOLUME_LIMIT_USDT()).to.equal(20);
    });
  });

  describe("Payment Processing", function () {
    it("Should process ETH payments correctly", async function () {
      const paymentAmount = ethers.parseEther("1");
      const initialMerchantBalance = await ethers.provider.getBalance(merchant1.address);

      await expect(paymentContract.connect(customer).processPayment(
        merchant1.address,
        0,
        ZERO_ADDRESS,
        paymentAmount,
        paymentAmount,
        { value: paymentAmount }
      )).to.emit(paymentContract, "PaymentProcessed")
        .withArgs(customer.address, merchant1.address, 0, ZERO_ADDRESS, paymentAmount, 0, paymentAmount);

      const finalMerchantBalance = await ethers.provider.getBalance(merchant1.address);
      expect(finalMerchantBalance - initialMerchantBalance).to.equal(paymentAmount);
    });

    it("Should process ERC20 token payments correctly", async function () {
      const paymentAmount = ethers.parseEther("10");
      await erc20Token.connect(customer).approve(paymentContract.getAddress(), paymentAmount);

      await expect(paymentContract.connect(customer).processPayment(
        merchant1.address,
        0,
        erc20Token.getAddress(),
        paymentAmount,
        paymentAmount
      )).to.emit(paymentContract, "PaymentProcessed")
        .withArgs(customer.address, merchant1.address, 0, await erc20Token.getAddress(), paymentAmount, 0, paymentAmount);

      expect(await erc20Token.balanceOf(merchant1.address)).to.equal(paymentAmount);
    });

    
    it("Should charge fees for premium merchants", async function () {
        await merchantRegister.connect(merchant1).upgradeToPremium();
        const paymentAmount = ethers.parseEther("100");
        const feePercentage = await paymentContract.FEE_PERCENTAGE();
        const expectedFee = (paymentAmount * BigInt(feePercentage)) / 100n;
      
        await erc20Token.connect(customer).approve(paymentContract.getAddress(), paymentAmount);
      
        await expect(paymentContract.connect(customer).processPayment(
          merchant1.address,
          0,
          await erc20Token.getAddress(),
          paymentAmount,
          paymentAmount
        )).to.emit(paymentContract, "PaymentProcessed")
          .withArgs(customer.address, merchant1.address, 0, await erc20Token.getAddress(), paymentAmount, expectedFee, paymentAmount);
      
        expect(await erc20Token.balanceOf(merchant1.address)).to.equal(paymentAmount - expectedFee);
        expect(await erc20Token.balanceOf(await owner.getAddress())).to.equal(expectedFee);
      });
    
    
      
      
    it("Should update transaction records correctly", async function () {
      const paymentAmount = ethers.parseEther("5");
      const initialTransactionCount = await ownerContract.totalTransactionCount();
      const initialTransactionVolume = await ownerContract.totalTransactionVolume();

      await paymentContract.connect(customer).processPayment(
        merchant1.address,
        0,
        ZERO_ADDRESS,
        paymentAmount,
        paymentAmount,
        { value: paymentAmount }
      );

      expect(await ownerContract.totalTransactionCount()).to.equal(initialTransactionCount + 1n);
      expect(await ownerContract.totalTransactionVolume()).to.equal(initialTransactionVolume + paymentAmount);

      const [storeTransactionCount, storeTransactionVolume] = await storeContract.viewStoreTransactions(merchant1.address, 0);
      expect(storeTransactionCount).to.equal(1);
      expect(storeTransactionVolume).to.equal(paymentAmount);
    });

    it("Should revert if payment amount doesn't match sent value for ETH payments", async function () {
      const paymentAmount = ethers.parseEther("1");
      await expect(paymentContract.connect(customer).processPayment(
        merchant1.address,
        0,
        ZERO_ADDRESS,
        paymentAmount,
        paymentAmount,
        { value: ethers.parseEther("0.5") }
      )).to.be.revertedWith("Incorrect payment amount");
    });

    it("Should revert if merchant is not registered", async function () {
      await expect(paymentContract.connect(customer).processPayment(
        addr4.address,
        0,
        ZERO_ADDRESS,
        ethers.parseEther("1"),
        ethers.parseEther("1"),
        { value: ethers.parseEther("1") }
      )).to.be.revertedWith("Merchant not registered");
    });

    it("Should revert if store does not exist", async function () {
      await expect(paymentContract.connect(customer).processPayment(
        merchant1.address,
        999, // Non-existent store ID
        ZERO_ADDRESS,
        ethers.parseEther("1"),
        ethers.parseEther("1"),
        { value: ethers.parseEther("1") }
      )).to.be.revertedWith("Store does not exist");
    });

    it("Should revert if token is not accepted by the store", async function () {
      await expect(paymentContract.connect(customer).processPayment(
        merchant1.address,
        0,
        unsupportedToken.getAddress(),
        ethers.parseEther("1"),
        ethers.parseEther("1")
      )).to.be.revertedWith("Token not accepted by the store");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero amount payments", async function () {
      await expect(paymentContract.connect(customer).processPayment(
        merchant1.address,
        0,
        ZERO_ADDRESS,
        0,
        0,
        { value: 0 }
      )).to.emit(paymentContract, "PaymentProcessed")
        .withArgs(customer.address, merchant1.address, 0, ZERO_ADDRESS, 0, 0, 0);
    });


    it("Should handle payment amounts that result in zero fees", async function () {
      await merchantRegister.connect(merchant1).upgradeToPremium();
      const paymentAmount = 19n; // 5% of 19 is less than 1

      await erc20Token.connect(customer).approve(paymentContract.getAddress(), paymentAmount);

      await expect(paymentContract.connect(customer).processPayment(
        merchant1.address,
        0,
        erc20Token.getAddress(),
        paymentAmount,
        paymentAmount
      )).to.emit(paymentContract, "PaymentProcessed")
        .withArgs(customer.address, merchant1.address, 0, await erc20Token.getAddress(), paymentAmount, 0, paymentAmount);
    });
  });
});