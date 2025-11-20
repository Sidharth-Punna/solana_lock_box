// Anchor helper for the `lock_box_anchor` program
// This provides typed program access, IDL exports, and cluster-based program ID selection.

import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import LockBoxAnchorIDL from './idl/lock_box_anchor.json'
import type { LockBoxAnchor } from './types/lock_box_anchor'

// Re-export the IDL and the generated type
export type { LockBoxAnchor, LockBoxAnchorIDL }

// Extract the program ID directly from the IDL metadata
export const LOCK_BOX_PROGRAM_ID = new PublicKey(LockBoxAnchorIDL.address)

// This is a helper function to get the Counter Anchor program.
export function getLockBoxProgram(provider: AnchorProvider, address?: PublicKey): Program<LockBoxAnchor> {
  return new Program(
    { ...LockBoxAnchorIDL, address: address ? address.toBase58() : LockBoxAnchorIDL.address } as LockBoxAnchor,
    provider,
  )
}

// Allow switching program IDs depending on cluster
export function getLockBoxProgramId(cluster: Cluster): PublicKey {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // Insert your deployed Devnet/Testnet program ID here if different
      return new PublicKey('FkFyFob5oYm4Q9aukvK1ttXduveWh16HYmhCvMXyw6tr')

    case 'mainnet-beta':
    default:
      return LOCK_BOX_PROGRAM_ID
  }
}
