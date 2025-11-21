use crate::errors::LockBoxError;
use crate::states::{LockBox, LOCKBOX_SEED};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeLockBox<'info> {
    #[account(
        init,
        payer = owner,
        space = LockBox::LEN,
        seeds = [LOCKBOX_SEED, owner.key().as_ref()],
        bump
    )]
    pub lockbox: Account<'info, LockBox>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn initialize_lockbox(ctx: Context<InitializeLockBox>, target_amount: u64) -> Result<()> {
    require!(target_amount > 0, LockBoxError::InvalidTargetAmount);

    let lockbox = &mut ctx.accounts.lockbox;
    let clock = Clock::get()?;

    lockbox.owner = ctx.accounts.owner.key();
    lockbox.target_amount = target_amount;
    lockbox.current_balance = 0;
    lockbox.created_at = clock.unix_timestamp;
    lockbox.has_reached_target = false;
    lockbox.bump = ctx.bumps.lockbox;

    msg!("LockBox created with target: {} lamports", target_amount);

    Ok(())
}
