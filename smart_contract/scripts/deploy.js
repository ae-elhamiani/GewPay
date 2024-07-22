const { ethers } = require("hardhat");

async function main() {
  // Get the contract factories
  const OwnerContract = await ethers.getContractFactory("OwnerContract");
  const MerchantRegister = await ethers.getContractFactory("MerchantRegister");
  const StoreContract = await ethers.getContractFactory("StoreContract");
  const PaymentContract = await ethers.getContractFactory("PaymentContract");

  // Deploy the OwnerContract
  const ownerContract = await OwnerContract.deploy();
  console.log("OwnerContract deployed to:", await ownerContract.getAddress());

  // Deploy the MerchantRegister, passing the address of the OwnerContract
  const merchantRegister = await MerchantRegister.deploy(await ownerContract.getAddress());
  console.log("MerchantRegister deployed to:", await merchantRegister.getAddress());

  // Deploy the StoreContract, passing the addresses of the OwnerContract and MerchantRegister
  const storeContract = await StoreContract.deploy(await ownerContract.getAddress(), await merchantRegister.getAddress());
  console.log("StoreContract deployed to:", await storeContract.getAddress());

  // Deploy the PaymentContract, passing the addresses of the OwnerContract, MerchantRegister, and StoreContract
  const paymentContract = await PaymentContract.deploy(
    await ownerContract.getAddress(),
    await merchantRegister.getAddress(),
    await storeContract.getAddress()
  );
  console.log("PaymentContract deployed to:", await paymentContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });