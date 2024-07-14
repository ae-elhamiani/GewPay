// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IMerchantRegister.sol";
import "./OwnerContract.sol";

contract MerchantRegister is IMerchantRegister {
    OwnerContract public ownerContract;

    struct Merchant {
        bool isRegistered;
        bool isPremium;
    }

    mapping(address => Merchant) public merchants;

    event MerchantRegistered(address indexed merchant);

    constructor(address _ownerContractAddress) {
        ownerContract = OwnerContract(_ownerContractAddress);
    }

    function registerMerchant() external override {
        require(!merchants[msg.sender].isRegistered, "Merchant already registered");

        merchants[msg.sender] = Merchant({
            isRegistered: true,
            isPremium: false
        });

        ownerContract.incrementMerchantCount();

        emit MerchantRegistered(msg.sender);
    }

    function merchantInfo(address merchant) external view returns (bool isRegistered, bool isPremium){
        require(merchants[merchant].isRegistered, "Merchant not registered");
        Merchant storage m = merchants[merchant];
        return (m.isRegistered, m.isPremium);
    }
}