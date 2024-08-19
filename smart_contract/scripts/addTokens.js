const { ethers } = require("hardhat");

async function main() {
    const ownerContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your OwnerContract address

    // Replace with the token addresses you want to add
    const tokenAddresses = [
       
        '0x1234567890123456789012345678901234567810',
  '0x2345678901234567890123456789012345678911',
  '0x3456789012345678901234567890123456789022',
  '0x4567890123456789012345678901234567890133'
    ];
    

    const OwnerContract = await ethers.getContractFactory("OwnerContract");
    const ownerContract = await OwnerContract.attach(ownerContractAddress);

    const tx = await ownerContract.addTokens(tokenAddresses);
    await tx.wait();

    console.log(`Tokens added successfully: ${tokenAddresses.join(", ")}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
