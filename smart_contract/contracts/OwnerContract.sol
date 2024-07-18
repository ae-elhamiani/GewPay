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

   
// merchant and store

    function incrementMerchantCount() external {
        totalMerchantCount += 1;
        emit MerchantCountIncremented(totalMerchantCount);
    }

    function incrementStoreCount() external {
        totalStoreCount += 1;
        emit StoreCountIncremented(totalStoreCount);
    }

    function viewTotalMerchants() external view returns (uint256) {
        return totalMerchantCount;
    }

    function viewTotalStoreCount() external view returns (uint256) {
        return totalStoreCount;
    }

  

    function isTokenSupported(address token) external view returns (bool) {
        return tokenSupport[token];
    }
}
}