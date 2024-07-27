const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MerchantRegister", function () {
    let ownerContract;
    let merchantRegister;
    let owner;
    let addr1;
    let addr2;
  
    beforeEach(async function () {
      [owner, addr1, addr2] = await ethers.getSigners();
    
      const OwnerContract = await ethers.getContractFactory("OwnerContract");
      ownerContract = await OwnerContract.deploy();
      
      const MerchantRegister = await ethers.getContractFactory("MerchantRegister");
      merchantRegister = await MerchantRegister.deploy(await ownerContract.getAddress());
    
      await ownerContract.waitForDeployment();
      await merchantRegister.waitForDeployment();
    });

  describe("Register Merchant", function () {
    it("Should register a new merchant", async function () {
      await merchantRegister.connect(addr1).registerMerchant();
      const [isRegistered, isPremium] = await merchantRegister.merchantInfo(addr1.address);
      expect(isRegistered).to.be.true;
      expect(isPremium).to.be.false;
    });

    it("Should increment merchant count in owner contract", async function () {
      await merchantRegister.connect(addr1).registerMerchant();
      expect(await ownerContract.viewTotalMerchants()).to.equal(1);
    });

    it("Should revert if merchant is already registered", async function () {
      await merchantRegister.connect(addr1).registerMerchant();
      await expect(merchantRegister.connect(addr1).registerMerchant()).to.be.revertedWith("Merchant already registered");
    });
  });

  describe("Upgrade to Premium", function () {
    it("Should upgrade a registered merchant to premium", async function () {
      await merchantRegister.connect(addr1).registerMerchant();
      await merchantRegister.connect(addr1).upgradeToPremium();
      const [isRegistered, isPremium] = await merchantRegister.merchantInfo(addr1.address);
      expect(isRegistered).to.be.true;
      expect(isPremium).to.be.true;
    });

    it("Should revert if merchant is not registered", async function () {
      await expect(merchantRegister.connect(addr1).upgradeToPremium()).to.be.revertedWith("Merchant not registered");
    });

    it("Should revert if merchant is already premium", async function () {
      await merchantRegister.connect(addr1).registerMerchant();
      await merchantRegister.connect(addr1).upgradeToPremium();
      await expect(merchantRegister.connect(addr1).upgradeToPremium()).to.be.revertedWith("Already a premium merchant");
    });
  });

  describe("View Merchant Plan", function () {
    it("Should return correct merchant plan", async function () {
      await merchantRegister.connect(addr1).registerMerchant();
      expect(await merchantRegister.viewMerchantPlan(addr1.address)).to.be.false;
      await merchantRegister.connect(addr1).upgradeToPremium();
      expect(await merchantRegister.viewMerchantPlan(addr1.address)).to.be.true;
    });

    it("Should revert if merchant is not registered", async function () {
      await expect(merchantRegister.viewMerchantPlan(addr1.address)).to.be.revertedWith("Merchant not registered");
    });
  });
});