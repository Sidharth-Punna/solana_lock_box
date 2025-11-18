use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod states;

use instructions::*;

declare_id!("CFqTCCmeoUyHUMmhZRJ5JyBLmSQWaqcqsd6A8rtH6MWR");

#[program]
pub mod lock_box_anchor {
    use super::*;

    /// Initialize a new LockBox vault with a target amount
    pub fn initialize_lockbox(ctx: Context<InitializeLockBox>, target_amount: u64) -> Result<()> {
        instructions::initialize_lockbox(ctx, target_amount)
    }

    /// Deposit SOL into the LockBox vault
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        instructions::deposit(ctx, amount)
    }

    /// Withdraw SOL from the LockBox vault (only when target is reached)
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        instructions::withdraw(ctx, amount)
    }

    /// Emergency withdrawal - withdraws all funds but deactivates the vault permanently
    pub fn emergency_withdraw(ctx: Context<EmergencyWithdraw>) -> Result<()> {
        instructions::emergency_withdraw(ctx)
    }
}
