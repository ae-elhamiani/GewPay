// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IOwnerContract.sol";
import "./IMerchantRegister.sol";
import "./IStoreContract.sol";

interface IPaymentContract {
    function processPayment(address merchant, uint256 storeId, address token, uint256 amount, uint256 usdtEquivalent) external payable;

    event PaymentProcessed(address indexed client, address indexed merchant, uint256 storeId, address token, uint256 amount, uint256 fee);

}