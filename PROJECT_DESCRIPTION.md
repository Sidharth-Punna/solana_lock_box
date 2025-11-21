# Project Description

**Deployed Frontend URL:** https://solana-lock-box.vercel.app/

**Solana Program ID:** FkFyFob5oYm4Q9aukvK1ttXduveWh16HYmhCvMXyw6tr

## Project Overview

### Description

LockBox is a decentralized savings application built on Solana that helps users achieve their financial goals by locking their funds until a specific target amount is reached. Users can create personal "Lock Box," set a savings goal, and deposit SOL over time. The funds are held securely in a Program Derived Address (PDA) vault and can only be withdrawn once the target goal is met, encouraging disciplined saving habits. For unforeseen circumstances, an emergency withdrawal feature allows users to recover their funds at the cost of closing the account.

### Key Features

- **Create Lock Box**: Initialize a personalized savings vault with a specific target amount (in SOL).
- **Deposit Funds**: Add SOL to your Lock Box at any time to progress towards your goal.
- **Goal-Based Withdrawal**: Withdrawals are only enabled once the target amount is reached, enforcing saving discipline.
- **Emergency Withdraw**: In critical situations, users can withdraw all funds immediately, which will automatically close and deactivate the Lock Box.
- **Close Lock Box**: Users can close their Lock Box and reclaim the rent deposit once the balance is zero (after a successful withdrawal).
- **Real-time Progress Tracking**: View current balance, progress percentage, and remaining amount to reach the goal.

### How to Use the dApp

1. **Connect Wallet**: Click the "Connect Wallet" button to connect your Solana wallet (e.g., Phantom, Solflare).
2. **Create Lock Box**:
   - Click "Create Your First Lock Box".
   - Enter your target savings amount in SOL.
   - Confirm the transaction to initialize your vault.
3. **Deposit SOL**:
   - Click the "Deposit SOL" button.
   - Enter the amount you wish to save.
   - Approve the transaction to transfer funds to your secure vault.
4. **Withdraw Funds**:
   - Once your target is reached, the "Withdraw" button becomes active.
   - You can withdraw partial or full amounts from your savings.
5. **Emergency Options**:
   - If you need funds before the target is reached, use the "More options" menu (three dots) to select "Emergency Withdraw".
   - **Warning**: This will withdraw all funds and permanently close your Lock Box.
6. **Close Account**:
   - After withdrawing all funds, use the "Close Lock Box" option to close the account and recover the rent deposit (~0.002 SOL).

## Program Architecture

The LockBox dApp utilizes a secure architecture with Program Derived Addresses (PDAs) to ensure that each user's funds are isolated and can only be managed by the owner.

### PDA Usage

The program uses two types of PDAs to manage state and funds securely:

**PDAs Used:**

- **LockBox State PDA**: Derived from seeds `["lockbox", owner_pubkey]`. Stores the account state (owner, target, balance, etc.).
- **Vault PDA**: Derived from seeds `["vault", lockbox_pubkey]`. This is the system account that holds the actual SOL tokens, ensuring the program has full control over fund transfers.

### Program Instructions

The program implements the following core instructions:

**Instructions Implemented:**

- **initialize_lockbox**: Creates a new `LockBox` account and sets the target savings amount.
- **deposit**: Transfers SOL from the user to the Vault PDA and updates the `LockBox` balance. Checks if the target has been reached.
- **withdraw**: Allows the user to withdraw SOL from the Vault PDA to their wallet. Only succeeds if `has_reached_target` is true.
- **emergency_withdraw**: Allows the user to withdraw all funds regardless of the target status. This action closes the `LockBox` account and returns rent to the user.
- **close_lockbox**: Closes an empty `LockBox` account and refunds the rent exemption lamports to the owner. Requires the vault balance to be 0.

### Account Structure

The main state account `LockBox` tracks the user's progress:

```rust
#[account]
pub struct LockBox {
    pub owner: Pubkey,            // The wallet that owns this lockbox
    pub target_amount: u64,       // Goal amount in lamports
    pub current_balance: u64,     // Current balance in lamports
    pub created_at: i64,          // Timestamp when created
    pub has_reached_target: bool, // Flag to enable withdrawals
    pub bump: u8,                 // PDA bump seed
}
```

## Testing

### Test Coverage

The project includes a comprehensive test suite written in TypeScript using the Anchor framework. It covers the entire lifecycle of a Lock Box, ensuring security and correct functionality.

**Happy Path Tests:**

- **Initialization**: Successfully creating a Lock Box with a valid target.
- **Deposits**: Verifying balance updates and vault funding.
- **Goal Achievement**: Confirming that reaching the target enables withdrawals.
- **Withdrawals**: Successfully withdrawing funds after the goal is met.
- **Account Closure**: Closing the account and reclaiming rent after emptying the vault.

**Unhappy Path Tests:**

- **Zero Target**: Preventing creation of a Lock Box with 0 target.
- **Duplicate Init**: Preventing initialization if a Lock Box already exists.
- **Premature Withdrawal**: ensuring withdrawals fail if the target hasn't been reached.
- **Unauthorized Access**: Verifying that users cannot deposit/withdraw from others' Lock Boxes.
- **Overdraft**: Preventing withdrawals exceeding the available balance.
- **Closed Vault Operations**: Ensuring no deposits/withdrawals can occur on a closed/inactive vault.

### Running Tests

To run the test suite:

```bash
yarn install
anchor test
```

### Additional Notes for Evaluators

The "Emergency Withdraw" feature was a key design decision to prevent users' funds from being permanently locked if they can never reach their target (e.g., financial hardship). This trade-off (closing the account) ensures the mechanism isn't abused for a regular savings account while providing a safety net.
