const { ethers } = require("hardhat");

async function main() {
  // Get the Contract Factory
  const MerchantRegister = await ethers.getContractFactory("MerchantRegister");

  // Deploy MerchantRegister if not already deployed
  // If already deployed, use the existing address instead
  const merchantRegister = await MerchantRegister.deploy();
  await merchantRegister.deployed();
  console.log("MerchantRegister deployed to:", merchantRegister.address);

  // Get all signers
  const signers = await ethers.getSigners();

  // Print all available addresses
  console.log("Available addresses:");
  signers.forEach((signer, index) => {
    console.log(`${index}: ${signer.address}`);
  });

  // Choose a merchant (you can modify this index as needed)
  const merchantIndex = 1; // Change this to select a different merchant
  const merchant = signers[merchantIndex];

  console.log(`\nUsing merchant address: ${merchant.address}`);

  // Register the merchant
  console.log("Registering merchant...");
  const tx = await merchantRegister.connect(merchant).registerMerchant();
  await tx.wait();
  console.log("Merchant registered");

  // Verify the merchant registration
  const merchantInfo = await merchantRegister.merchantInfo(merchant.address);
  console.log("Merchant info:", merchantInfo);

  console.log("Merchant registration complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });