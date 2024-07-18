const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OwnerContract", function () {
  let ownerContract;
  let owner;
  let newOwner;
  let addr1;
  let addr2;
  let addr3;
  let token1;
  let token2;
  let token3;
  let erc20;

  beforeEach(async function () {
    [owner, newOwner, addr1, addr2, addr3] = await ethers.getSigners();

    const OwnerContract = await ethers.getContractFactory("OwnerContract");
    ownerContract = await OwnerContract.deploy();


    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    erc20 = await ERC20Mock.deploy("Mock Token", "MTK", owner.address, ethers.parseEther("1000"));

    await ownerContract.waitForDeployment();
    await erc20.waitForDeployment();

    token1 = addr1.address;
    token2 = addr2.address;
    token3 = addr3.address;
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await ownerContract.owner()).to.equal(owner.address);
    });
  });

  describe("Token management", function () {
    it("Should add multiple tokens", async function () {
      await expect(ownerContract.addTokens([token1, token2, token3]))
        .to.emit(ownerContract, "TokenAdded").withArgs(token1)
        .to.emit(ownerContract, "TokenAdded").withArgs(token2)
        .to.emit(ownerContract, "TokenAdded").withArgs(token3);

      expect(await ownerContract.tokenSupport(token1)).to.equal(true);
      expect(await ownerContract.tokenSupport(token2)).to.equal(true);
      expect(await ownerContract.tokenSupport(token3)).to.equal(true);
      const tokens = await ownerContract.getSupportedTokens();
      expect(tokens).to.include(token1);
      expect(tokens).to.include(token2);
      expect(tokens).to.include(token3);
    });

    it("Should remove multiple tokens", async function () {
      await ownerContract.addTokens([token1, token2, token3]);
      await expect(ownerContract.removeTokens([token1, token2]))
        .to.emit(ownerContract, "TokenRemoved").withArgs(token1)
        .to.emit(ownerContract, "TokenRemoved").withArgs(token2);

      expect(await ownerContract.tokenSupport(token1)).to.equal(false);
      expect(await ownerContract.tokenSupport(token2)).to.equal(false);
      expect(await ownerContract.tokenSupport(token3)).to.equal(true);
      const tokens = await ownerContract.getSupportedTokens();
      expect(tokens).to.not.include(token1);
      expect(tokens).to.not.include(token2);
      expect(tokens).to.include(token3);
    });

    it("Should revert if non-owner tries to add tokens in batch", async function () {
      await expect(ownerContract.connect(addr1).addTokens([token1, token2])).to.be.revertedWith("Not authorized");
    });

    it("Should revert if non-owner tries to remove tokens in batch", async function () {
      await ownerContract.addTokens([token1, token2]);
      await expect(ownerContract.connect(addr1).removeTokens([token1, token2])).to.be.revertedWith("Not authorized");
    });

    it("Should revert if adding already supported tokens", async function () {
      await ownerContract.addTokens([token1, token2]);
      await expect(ownerContract.addTokens([token1, token2])).to.be.revertedWith("Token already supported");
    });

    it("Should revert if removing non-supported tokens", async function () {
      await expect(ownerContract.removeTokens([token1, token2])).to.be.revertedWith("Token not supported");
    });
  });

  describe("System Transactions", function () {
    it("Should return the correct system transactions data", async function () {
      const [count, volume] = await ownerContract.viewSystemTransactions();
      expect(count).to.equal(0);
      expect(volume).to.equal(0);
    });

    it("Should increment the transaction count", async function () {
      await expect(ownerContract.incrementTransactionCount())
        .to.emit(ownerContract, "TransactionCountIncremented").withArgs(1);
      const [count] = await ownerContract.viewSystemTransactions();
      expect(count).to.equal(1);
    });

    it("Should add to the transaction volume", async function () {
      await expect(ownerContract.addTransactionVolume(1000))
        .to.emit(ownerContract, "TransactionVolumeAdded").withArgs(1000, 1000);
      const [, volume] = await ownerContract.viewSystemTransactions();
      expect(volume).to.equal(1000);
    });

    it("Should collect the ERC-20 fee correctly", async function () {
      const feeAmount = ethers.parseEther("10");

      await erc20.transfer(await ownerContract.getAddress(), feeAmount);
      const usdtEquivalent = 1000; // Example USDT equivalent value for the test
      await expect(ownerContract.collectFee(erc20.getAddress(), feeAmount, usdtEquivalent))
        .to.emit(ownerContract, "FeeCollected").withArgs(await erc20.getAddress(), feeAmount);
      expect(await ownerContract.tokenFeesCollected(erc20.getAddress())).to.equal(feeAmount);
      expect(await ownerContract.viewTotalFee()).to.equal((usdtEquivalent * 5) / 100);
    });
  });

  describe("Merchants and Stores", function () {
    it("Should increment the merchant count", async function () {
      await expect(ownerContract.incrementMerchantCount())
        .to.emit(ownerContract, "MerchantCountIncremented").withArgs(1);
      expect(await ownerContract.viewTotalMerchants()).to.equal(1);
    });

    it("Should increment the store count", async function () {
      await expect(ownerContract.incrementStoreCount())
        .to.emit(ownerContract, "StoreCountIncremented").withArgs(1);
      expect(await ownerContract.viewTotalStoreCount()).to.equal(1);
    });

    it("Should handle multiple merchant and store increments", async function () {
      await ownerContract.incrementMerchantCount();
      await ownerContract.incrementMerchantCount();
      await ownerContract.incrementStoreCount();
      await ownerContract.incrementStoreCount();
      await ownerContract.incrementStoreCount();
      expect(await ownerContract.viewTotalMerchants()).to.equal(2);
      expect(await ownerContract.viewTotalStoreCount()).to.equal(3);
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      await expect(ownerContract.transferOwnership(newOwner.address))
        .to.emit(ownerContract, "OwnershipTransferred").withArgs(owner.address, newOwner.address);
      expect(await ownerContract.owner()).to.equal(newOwner.address);
    });

    it("Should revert if non-owner tries to transfer ownership", async function () {
      await expect(ownerContract.connect(addr1).transferOwnership(addr1.address)).to.be.revertedWith("Not authorized");
    });

  });
});