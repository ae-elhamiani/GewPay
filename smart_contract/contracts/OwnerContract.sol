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
        function addTokens(address[] calldata tokens) external onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            address token = tokens[i];
            require(!tokenSupport[token], "Token already supported");
            tokenSupport[token] = true;
            supportedTokens.push(token);
            emit TokenAdded(token);
        }
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

   
}