use anchor_lang::prelude::*;

#[error_code]
pub enum LockBoxError {
    #[msg("Target amount must be greater than zero")]
    InvalidTargetAmount,

    #[msg("Deposit amount must be greater than zero")]
    InvalidDepositAmount,

    #[msg("Target not reached yet. Current balance is below the target amount.")]
    TargetNotReached,

    #[msg("This vault has been deactivated and is no longer accessible")]
    VaultInactive,

    #[msg("Unauthorized: Only the owner can perform this action")]
    Unauthorized,

    #[msg("Insufficient balance in vault for withdrawal")]
    InsufficientBalance,
}
