use anchor_lang::prelude::*;

// Seed constants for PDAs
pub const LOCKBOX_SEED: &[u8] = b"lockbox";
pub const VAULT_SEED: &[u8] = b"vault";

#[account]
pub struct LockBox {
    pub owner: Pubkey,            // 32 bytes
    pub target_amount: u64,       // 8 bytes - goal amount in lamports
    pub current_balance: u64,     // 8 bytes - current balance in lamports
    pub created_at: i64,          // 8 bytes - timestamp when created
    pub has_reached_target: bool, // 1 byte - whether target has been reached
    pub bump: u8,                 // 1 byte - PDA bump seed
}

impl LockBox {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 1 + 1 + 8; // discriminator + fields
}
