// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IMerchantRegister.sol";
import "./IOwnerContract.sol";

interface IStoreContract {

    function createStore(address[] calldata acceptedTokens) external;
    function viewStoreTokenAccepted(address merchant, uint256 storeId) external view returns (address[] memory acceptedTokens);
    function viewStoreTransactions(address merchant, uint256 storeId) external view returns (uint256 transactionCount, uint256 transactionVolume);
    function incrementStoreTransactionCount(address merchant, uint256 storeId) external;
    function addStoreTransactionVolume(address merchant, uint256 storeId, uint256 volume) external;
    function storeExists(address merchant, uint256 storeId) external view returns (bool);
}