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

   
// colected fee
    function collectFee(address token, uint256 amount, uint256 amountUSDT) external {
        totalFeeCollected = ( amountUSDT * 5 ) / 100;
        tokenFeesCollected[token] += amount;
        emit FeeCollected(token, amount);
    }


    function viewTotalFee() external view returns (uint256) {
        return totalFeeCollected;  
    }



}