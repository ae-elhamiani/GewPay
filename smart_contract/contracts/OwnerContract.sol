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

    function removeTokens(address[] calldata tokens) external onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            address token = tokens[i];
            require(tokenSupport[token], "Token not supported");
            tokenSupport[token] = false;

            uint256 lastTokenIndex = supportedTokens.length - 1;
            uint256 tokenIndex = findTokenIndex(token);
            supportedTokens[tokenIndex] = supportedTokens[lastTokenIndex];
            supportedTokens.pop();
            emit TokenRemoved(token);
        }
    }

    function findTokenIndex(address token) internal view returns (uint256) {
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            if (supportedTokens[i] == token) {
                return i;
            }
        }
        revert("Token not found");
    }

    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
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

        function addTokens(address[] calldata tokens) external onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            address token = tokens[i];
            require(!tokenSupport[token], "Token already supported");
            tokenSupport[token] = true;
            supportedTokens.push(token);
            emit TokenAdded(token);
        }
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