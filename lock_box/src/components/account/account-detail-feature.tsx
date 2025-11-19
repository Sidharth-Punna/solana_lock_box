'use client'

import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { AccountBalance, AccountButtons, AccountTransactions } from './account-ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { Wallet, AlertCircle } from 'lucide-react'

export default function AccountDetailFeature() {
  const params = useParams()
  const address = useMemo(() => {
    if (!params.address) {
      return
    }
    try {
      return new PublicKey(params.address)
    } catch (e) {
      console.log(`Invalid public key`, e)
    }
  }, [params])
  if (!address) {
    return (
      <div className="container mx-auto py-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle />
            </EmptyMedia>
            <EmptyTitle>Error Loading Account</EmptyTitle>
            <EmptyDescription>Invalid account address. Please check the address and try again.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle>Account Overview</CardTitle>
          </div>
          <CardDescription>View account balance, address, and manage airdrops</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4">
            <AccountBalance address={address} />
            <div className="border-t pt-4">
              <AccountButtons address={address} />
            </div>
          </div>
        </CardContent>
      </Card>
      <AccountTransactions address={address} />
    </div>
  )
}
