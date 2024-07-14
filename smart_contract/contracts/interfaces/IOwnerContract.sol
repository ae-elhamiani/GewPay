// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IOwnerContract {
    function transferOwnership(address newOwner) external;
    function addTokens(address[] calldata tokens) external;
    function removeTokens(address[] calldata tokens) external;
    function getSupportedTokens() external view returns (address[] memory);
    function viewSystemTransactions() external view returns (uint256, uint256);
    function viewTotalFee() external view returns (uint256);
    function viewTotalMerchants() external view returns (uint256);
    function incrementTransactionCount() external;
    function addTransactionVolume(uint256 volume) external;
    function collectFee(address token, uint256 amount, uint256 amountUSDT) external; 
    function incrementMerchantCount() external;
    function incrementStoreCount() external;
    function tokenSupport(address token) external view returns (bool);
    function viewTotalStoreCount() external view returns (uint256); 
    function tokenFeesCollected(address token) external view returns (uint256); 

    // Events
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event TokenAdded(address token);
    event TokenRemoved(address token);
    event FeeCollected(address token, uint256 amount);
    event TransactionCountIncremented(uint256 newTransactionCount);
    event TransactionVolumeAdded(uint256 volume, uint256 newTotalTransactionVolume);
    event MerchantCountIncremented(uint256 newTotalMerchantCount);
    event StoreCountIncremented(uint256 newTotalStoreCount);
}
