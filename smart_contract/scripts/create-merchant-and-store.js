const { ethers } = require("hardhat");

async function main() {
  // Get the Contract Factories
  const MerchantRegister = await ethers.getContractFactory("MerchantRegister");
  const StoreContract = await ethers.getContractFactory("StoreContract");
  const OwnerContract = await ethers.getContractFactory("OwnerContract");
  const PaymentContract = await ethers.getContractFactory("PaymentContract");


  // Get the deployed contract addresses
  const merchantRegisterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const storeContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const ownerContractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const paymentContractAddress = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9";


  // Attach to the deployed contracts
  const merchantRegister = await MerchantRegister.attach(merchantRegisterAddress);
  const storeContract = await StoreContract.attach(storeContractAddress);
  const ownerContract = await OwnerContract.attach(ownerContractAddress);
  const paymentContract = await PaymentContract.attach(paymentContractAddress);


  // Get signers
  const [owner, merchant1, merchant2, merchant3, merchant4,  merchant5, merchant6,merchant7, merchant8, merchant9, merchant] = await ethers.getSigners();

  console.log("Using owner address:", owner.address);
  console.log("Using merchant address:", merchant.address);
  // Define token addresses
  const tokenAddresses = [
    "0x1234567890123456789012345678901234567890",
    "0x2345678901234567890123456789012345678901",
    "0x3456789012345678901234567890123456789012",
    "0x4567890123456789012345678901234567890123"
  ];

  const tokenAddresses1 = [
    "0x3456789012345678901234567890123456789012",
  ];

  const tokenAddresses2 = [
    "0x3456789012345678901234567890123456789012",
    "0x1234567890123456789012345678901234567890",
    "0x0000000000000000000000000000000000000000"
  ];

  const tokenAddresses3 = [
    "0x3456789012345678901234567890123456789012",
    "0x1234567890123456789012345678901234567890",
     "0x3456789012345678901234567890123456789012",
    "0x4567890123456789012345678901234567890123"
  ];
  const token =[
    "0x3456789012345678901234567890123456789012",
  ]
  const ZERO_ADDRESS = ethers.ZeroAddress;
  console.log("Processing payment...");
  
  const paymentAmount = ethers.parseEther("0.003"); // 0.1 ETH

  const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    // erc20Token = await ERC20Mock.deploy("Test Token", "TST", "0x3456789012345678901234567890123456789012", ethers.parseEther("1000"));

  // Add supported tokens
  console.log("Adding supported tokens...");
//   await ownerContract.connect(owner).addTokens([await erc20Token.getAddress(), ZERO_ADDRESS]);    //////add token
//   console.log("Tokens added");
 

  console.log("Registering merchant...");
  await merchantRegister.connect(merchant).registerMerchant();      /////register
  await merchantRegister.connect(merchant).upgradeToPremium();      /////upgrade
//   console.log("Merchant registered");

  console.log("Creating store...");
//   await storeContract.connect(merchant).createStore(tokenAddresses1);   ///create store
//   console.log("Store created");
//   await storeContract.connect(merchant).createStore(tokenAddresses2);
//   await storeContract.connect(merchant).createStore([await erc20Token.getAddress(), ZERO_ADDRESS]);
console.log(merchant1.address);
console.log(merchant2.address);
console.log(merchant3.address);
console.log(merchant4.address);
console.log(merchant5.address);
console.log(merchant6.address);
console.log(merchant7.address);
  console.log("make payment...");
//   await paymentContract.connect(merchant).processPayment(merchant7.address,3,ZERO_ADDRESS,paymentAmount,paymentAmount,{ value: paymentAmount })

  // Verify the store was created
//   const storeCount = await storeContract.storeCounts(merchant.address);
//   console.log("Merchant store count:", storeCount.toString());

  // Get supported tokens
//   const supportedTokens = await ownerContract.getSupportedTokens();
//   console.log("Supported tokens:", supportedTokens);

  console.log("Merchant and store creation complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

