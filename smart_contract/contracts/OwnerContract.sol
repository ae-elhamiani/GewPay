// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IOwnerContract.sol";

contract OwnerContract is IOwnerContract {
    address public owner;
    mapping(address => bool) public tokenSupport;
    address[] public supportedTokens;
    uint256 public totalTransactionVolume;
    uint256 public totalTransactionCount;
    uint256 public totalFeeCollected;
    mapping(address => uint256) public tokenFeesCollected;  // Tracks collected fees for each token
    uint256 public totalMerchantCount;
    uint256 public totalStoreCount;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), owner);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
//volume and transaction
    function viewSystemTransactions() external view returns (uint256, uint256) {
        return (totalTransactionCount, totalTransactionVolume);
    }

    function incrementTransactionCount() external {
        totalTransactionCount += 1;
        emit TransactionCountIncremented(totalTransactionCount);
    }
    
     function addTransactionVolume(uint256 volumeUSDT) external {
        totalTransactionVolume += volumeUSDT;
        emit TransactionVolumeAdded(volumeUSDT, totalTransactionVolume);
    }


   
}