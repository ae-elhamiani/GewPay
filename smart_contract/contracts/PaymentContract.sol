// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IPaymentContract.sol";
import "./OwnerContract.sol";
import "./MerchantRegister.sol";
import "./StoreContract.sol";

contract PaymentContract is IPaymentContract {
    OwnerContract public ownerContract;
    MerchantRegister public merchantRegister;
    StoreContract public storeContract;

    uint256 public constant FEE_PERCENTAGE = 5;
    uint256 public constant BASIC_PLAN_TRANSACTION_LIMIT = 20;
    uint256 public constant BASIC_PLAN_VOLUME_LIMIT_USDT = 20;

    event PaymentProcessed(address indexed client, address indexed merchant, uint256 storeId, address token, uint256 amount, uint256 fee, uint256 usdtEquivalent);

    constructor(address _ownerContractAddress, address _merchantRegisterAddress, address _storeContractAddress) {
        ownerContract = OwnerContract(_ownerContractAddress);
        merchantRegister = MerchantRegister(_merchantRegisterAddress);
        storeContract = StoreContract(_storeContractAddress);
    }

    function processPayment(address merchant, uint256 storeId, address token, uint256 amount, uint256 usdtEquivalent) external payable override {
        (bool isRegistered, bool isPremium) = merchantRegister.merchantInfo(merchant);
        require(isRegistered, "Merchant not registered");
        require(storeContract.storeExists(merchant, storeId), "Store does not exist");
        require(isTokenAcceptedByStore(merchant, storeId, token), "Token not accepted by the store");

        (uint256 transactionCount, uint256 transactionVolume) = storeContract.viewStoreTransactions(merchant, storeId);

        if (!isPremium) {
            require(transactionCount < BASIC_PLAN_TRANSACTION_LIMIT, "Transaction count limit exceeded");
            require(transactionVolume <= BASIC_PLAN_VOLUME_LIMIT_USDT, "Volume limit exceeded");
        }

        uint256 fee = 0;
        uint256 merchantAmount = amount;

        if (isPremium) {
            fee = (amount * FEE_PERCENTAGE) / 100;
            merchantAmount = amount - fee;
        }

        address owner = ownerContract.owner(); 

        if (token == address(0)) {
            require(msg.value == amount, "Incorrect payment amount");
            payable(merchant).transfer(merchantAmount);
            if (fee > 0) {
                payable(owner).transfer(fee); 
            }
        } else {
            IERC20 paymentToken = IERC20(token);
            require(paymentToken.transferFrom(msg.sender, merchant, merchantAmount), "Token transfer to merchant failed");
            if (fee > 0) {
                require(paymentToken.transferFrom(msg.sender, owner, fee), "Token transfer of fee failed"); 
            }
        }

        updateTransactionRecords(merchant, storeId, token, usdtEquivalent, fee);

        emit PaymentProcessed(msg.sender, merchant, storeId, token, amount, fee, usdtEquivalent);
    }

    function isTokenAcceptedByStore(address merchant, uint256 storeId, address token) internal view returns (bool) {
        address[] memory acceptedTokens = storeContract.viewStoreTokenAccepted(merchant, storeId);
        for (uint256 i = 0; i < acceptedTokens.length; i++) {
            if (acceptedTokens[i] == token) {
                return true;
            }
        }
        return false;
    }

    function updateTransactionRecords(address merchant, uint256 storeId, address token, uint256 usdtEquivalent, uint256 fee) internal {
        ownerContract.incrementTransactionCount();
        ownerContract.addTransactionVolume(usdtEquivalent);
        ownerContract.collectFee(token, fee, usdtEquivalent);

        storeContract.incrementStoreTransactionCount(merchant, storeId);
        storeContract.addStoreTransactionVolume(merchant, storeId, usdtEquivalent);
    }
}