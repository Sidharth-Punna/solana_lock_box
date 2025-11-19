'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { Wallet } from 'lucide-react'
import { redirect } from 'next/navigation'

export default function AccountListFeature() {
  const { publicKey } = useWallet()

  if (publicKey) {
    return redirect(`/account/${publicKey.toString()}`)
  }

  return (
    <div className="container mx-auto py-8">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Wallet />
          </EmptyMedia>
          <EmptyTitle>No Wallet Connected</EmptyTitle>
          <EmptyDescription>
            Connect your wallet to view your account balance, transaction history, and manage your Solana account.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <WalletButton />
        </EmptyContent>
      </Empty>
    </div>
  )
}
