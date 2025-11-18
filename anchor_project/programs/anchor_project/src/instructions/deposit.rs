use crate::errors::LockBoxError;
use crate::states::{LockBox, LOCKBOX_SEED, VAULT_SEED};
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [LOCKBOX_SEED, owner.key().as_ref()],
        bump = lockbox.bump,
        has_one = owner @ LockBoxError::Unauthorized
    )]
    pub lockbox: Account<'info, LockBox>,

    #[account(mut)]
    pub owner: Signer<'info>,

    /// CHECK: This is the PDA that will hold the SOL
    #[account(
        mut,
        seeds = [VAULT_SEED, lockbox.key().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    require!(amount > 0, LockBoxError::InvalidDepositAmount);
    require!(ctx.accounts.lockbox.is_active, LockBoxError::VaultInactive);

    // Transfer SOL from owner to vault PDA
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        Transfer {
            from: ctx.accounts.owner.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
        },
    );

    transfer(cpi_context, amount)?;

    // Update lockbox balance
    let lockbox = &mut ctx.accounts.lockbox;
    lockbox.current_balance = lockbox.current_balance.checked_add(amount).unwrap();

    msg!(
        "Deposited {} lamports. Current balance: {} / {} lamports",
        amount,
        lockbox.current_balance,
        lockbox.target_amount
    );

    // Check if target has been reached and set has_reached_target to true
    if lockbox.current_balance >= lockbox.target_amount {
        lockbox.has_reached_target = true;
        msg!("🎉 Target reached! You can now withdraw your funds.");
    }

    Ok(())
}
