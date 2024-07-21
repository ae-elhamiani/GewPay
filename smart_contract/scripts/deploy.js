const { ethers } = require("hardhat");

async function main() {
  // Get the contract factories
  const OwnerContract = await ethers.getContractFactory("OwnerContract");
  const MerchantRegister = await ethers.getContractFactory("MerchantRegister");
  const StoreContract = await ethers.getContractFactory("StoreContract");
  const PaymentContract = await ethers.getContractFactory("PaymentContract");

  // Deploy the OwnerContract
  const ownerContract = await OwnerContract.deploy();
  await ownerContract.deployed();
  console.log("OwnerContract deployed to:", ownerContract.address);

  // Deploy the MerchantRegister, passing the address of the OwnerContract
  const merchantRegister = await MerchantRegister.deploy(ownerContract.address);
  await merchantRegister.deployed();
  console.log("MerchantRegister deployed to:", merchantRegister.address);

  // Deploy the StoreContract, passing the addresses of the OwnerContract and MerchantRegister
  const storeContract = await StoreContract.deploy(ownerContract.address, merchantRegister.address);
  await storeContract.deployed();
  console.log("StoreContract deployed to:", storeContract.address);

  // Deploy the PaymentContract, passing the addresses of the OwnerContract, MerchantRegister, and StoreContract
  const paymentContract = await PaymentContract.deploy(ownerContract.address, merchantRegister.address, storeContract.address);
  await paymentContract.deployed();
  console.log("PaymentContract deployed to:", paymentContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
