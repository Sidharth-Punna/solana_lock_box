use crate::errors::LockBoxError;
use crate::states::{LockBox, LOCKBOX_SEED, VAULT_SEED};
use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [LOCKBOX_SEED, owner.key().as_ref()],
        bump = lockbox.bump,
        has_one = owner @ LockBoxError::Unauthorized
    )]
    pub lockbox: Account<'info, LockBox>,

    #[account(mut)]
    pub owner: Signer<'info>,

    /// CHECK: This is the PDA that holds the SOL
    #[account(
        mut,
        seeds = [VAULT_SEED, lockbox.key().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    let lockbox = &ctx.accounts.lockbox;

    // Check if target has been reached
    require!(lockbox.has_reached_target, LockBoxError::TargetNotReached);

    // Check if vault has sufficient balance
    require!(
        lockbox.current_balance >= amount,
        LockBoxError::InsufficientBalance
    );

    // Transfer SOL from vault to owner using CPI with signer seeds
    let lockbox_key = lockbox.key();
    let vault_seeds = &[VAULT_SEED, lockbox_key.as_ref(), &[ctx.bumps.vault]];
    let signer_seeds = &[&vault_seeds[..]];

    let cpi_context = CpiContext::new_with_signer(
        ctx.accounts.system_program.to_account_info(),
        Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.owner.to_account_info(),
        },
        signer_seeds,
    );

    transfer(cpi_context, amount)?;

    // Update lockbox balance
    let lockbox = &mut ctx.accounts.lockbox;
    lockbox.current_balance = lockbox.current_balance.checked_sub(amount).unwrap();

    msg!(
        "Withdrawn {} lamports. Remaining balance: {} lamports",
        amount,
        lockbox.current_balance
    );

    Ok(())
}
