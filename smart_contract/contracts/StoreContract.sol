// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IStoreContract.sol";
import "./MerchantRegister.sol";
import "./OwnerContract.sol";

contract StoreContract is IStoreContract{

    OwnerContract public ownerContract;
    MerchantRegister public merchantRegister;

    struct Store {
        address[] acceptedTokens;
        uint256 transactionCount;
        uint256 transactionVolume;
    }

    mapping(address => mapping(uint256 => Store)) public stores;
    mapping(address => uint256) public storeCounts;

    event StoreCreated(address indexed merchant, uint256 storeId);

    constructor(address _ownerContractAddress, address _merchantRegisterAddress) {
        ownerContract = OwnerContract(_ownerContractAddress);
        merchantRegister = MerchantRegister(_merchantRegisterAddress);
    }

   function createStore(address[] calldata acceptedTokens) external override {
        (bool isRegistered, bool isPremium) = merchantRegister.merchantInfo(msg.sender);
        require(isRegistered, "Merchant not registered");

        if (!isPremium) {
            require(storeCounts[msg.sender] == 0, "Basic plan merchants can only create one store");
        }

        for (uint256 i = 0; i < acceptedTokens.length; i++) {
            require(ownerContract.tokenSupport(acceptedTokens[i]), "Token not supported by owner");
        }

        uint256 storeId = storeCounts[msg.sender];
        stores[msg.sender][storeId] = Store({
            acceptedTokens: acceptedTokens,
            transactionCount: 0,
            transactionVolume: 0
        });
        storeCounts[msg.sender]++;

        emit StoreCreated(msg.sender, storeId);
    }
