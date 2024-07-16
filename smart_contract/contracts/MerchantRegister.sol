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

    event MerchantUpgraded(address indexed merchant);
    event MerchantRegistered(address indexed merchant);
    event MerchantUpgraded(address indexed merchant);

    constructor(address _ownerContractAddress) {
        ownerContract = OwnerContract(_ownerContractAddress);
    }

    function registerMerchant() external override {
        require(
            !merchants[msg.sender].isRegistered,
            "Merchant already registered"
        );

        merchants[msg.sender] = Merchant({
            isRegistered: true,
            isPremium: false
        });

        ownerContract.incrementMerchantCount();

        emit MerchantRegistered(msg.sender);
    }

    function upgradeToPremium() external override {
        require(merchants[msg.sender].isRegistered, "Merchant not registered");
        require(!merchants[msg.sender].isPremium, "Already a premium merchant");

        merchants[msg.sender].isPremium = true;

        emit MerchantUpgraded(msg.sender);
    }

    function viewMerchantPlan(address merchant) external view override returns (bool isPremium) {
        require(merchants[merchant].isRegistered, "Merchant not registered");
        return merchants[merchant].isPremium;
    }

    function merchantInfo(address merchant) external view returns (bool isRegistered, bool isPremium){
        require(merchants[merchant].isRegistered, "Merchant not registered");
        Merchant storage m = merchants[merchant];
        return (m.isRegistered, m.isPremium);
    }
}
