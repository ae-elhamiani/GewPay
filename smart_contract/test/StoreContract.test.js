const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StoreContract", function () {
  let ownerContract;
  let merchantRegister;
  let storeContract;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let token1;
  let token2;
  let token3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const OwnerContract = await ethers.getContractFactory("OwnerContract");
    ownerContract = await OwnerContract.deploy();
    await ownerContract.waitForDeployment();

    const MerchantRegister = await ethers.getContractFactory("MerchantRegister");
    merchantRegister = await MerchantRegister.deploy(await ownerContract.getAddress());
    await merchantRegister.waitForDeployment();

    const StoreContract = await ethers.getContractFactory("StoreContract");
    storeContract = await StoreContract.deploy(await ownerContract.getAddress(), await merchantRegister.getAddress());
    await storeContract.waitForDeployment();

    token1 = addr1.address;
    token2 = addr2.address;
    token3 = addr3.address;

    // Register merchants and add supported tokens
    await merchantRegister.connect(addr1).registerMerchant();
    await merchantRegister.connect(addr2).registerMerchant();
    await ownerContract.addTokens([token1, token2]);
  });

  describe("Create Store", function () {
    // ... (previous tests remain the same)

    it("Should emit StoreCreated event when a store is created", async function () {
      await expect(storeContract.connect(addr1).createStore([token1]))
        .to.emit(storeContract, "StoreCreated")
        .withArgs(addr1.address, 0);
    });

    it("Should correctly increment store count for a merchant", async function () {
      await merchantRegister.connect(addr1).upgradeToPremium();
      await storeContract.connect(addr1).createStore([token1]);
      await storeContract.connect(addr1).createStore([token2]);
      
      const storeCount = await storeContract.storeCounts(addr1.address);
      expect(storeCount).to.equal(2);
    });
  });

  describe("View Store Transactions", function () {
    // ... (previous tests remain the same)

    it("Should correctly update transaction count and volume for multiple transactions", async function () {
      await storeContract.connect(addr1).createStore([token1]);
      await storeContract.incrementStoreTransactionCount(addr1.address, 0);
      await storeContract.addStoreTransactionVolume(addr1.address, 0, 1000);
      await storeContract.incrementStoreTransactionCount(addr1.address, 0);
      await storeContract.addStoreTransactionVolume(addr1.address, 0, 2000);

      const [transactionCount, transactionVolume] = await storeContract.viewStoreTransactions(addr1.address, 0);
      expect(transactionCount).to.equal(2);
      expect(transactionVolume).to.equal(3000);
    });
  });

  describe("View Store Token Accepted", function () {
    it("Should return correct accepted tokens for a store", async function () {
      await storeContract.connect(addr1).createStore([token1, token2]);
      const acceptedTokens = await storeContract.viewStoreTokenAccepted(addr1.address, 0);
      expect(acceptedTokens).to.deep.equal([token1, token2]);
    });

    it("Should return an empty array for a non-existent store", async function () {
      const acceptedTokens = await storeContract.viewStoreTokenAccepted(addr2.address, 0);
      expect(acceptedTokens).to.be.an('array').that.is.empty;
    });
  });

  describe("Store Exists", function () {
    it("Should return true for an existing store", async function () {
      await storeContract.connect(addr1).createStore([token1]);
      const exists = await storeContract.storeExists(addr1.address, 0);
      expect(exists).to.be.true;
    });

    it("Should return false for a non-existent store", async function () {
      const exists = await storeContract.storeExists(addr1.address, 0);
      expect(exists).to.be.false;
    });

    it("Should return false for an out-of-bounds store ID", async function () {
      await storeContract.connect(addr1).createStore([token1]);
      const exists = await storeContract.storeExists(addr1.address, 1);
      expect(exists).to.be.false;
    });
  });

 
});