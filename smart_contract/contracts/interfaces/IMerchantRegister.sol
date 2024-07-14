// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IOwnerContract.sol";

interface IMerchantRegister {
    function registerMerchant() external;
    function upgradeToPremium() external;
    function viewMerchantPlan(address merchant) external view returns (bool isPremium);
    function merchantInfo(address merchant) external view returns (bool isRegistered, bool isPremium);

}