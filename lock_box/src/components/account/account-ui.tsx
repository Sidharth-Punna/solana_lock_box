'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { RefreshCw, Wallet, Copy, ExternalLink, History, CheckCircle2, XCircle, Coins, Clock, Hash } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useCluster } from '../cluster/cluster-data-access'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useGetBalance, useGetSignatures, useRequestAirdrop } from './account-data-access'
import { ellipsify } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { AppAlert } from '@/components/app-alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AppModal } from '@/components/app-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AccountBalance({ address }: { address: PublicKey }) {
  const query = useGetBalance({ address })

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-baseline gap-2">
        <Coins className="h-8 w-8 text-primary" />
        <h1 className="text-5xl font-bold cursor-pointer" onClick={() => query.refetch()}>
          {query.data ? <BalanceSol balance={query.data} /> : '...'}
        </h1>
        <span className="text-2xl font-semibold text-muted-foreground">SOL</span>
      </div>
      <Button variant="ghost" size="icon" onClick={() => query.refetch()} className="h-8 w-8" title="Refresh balance">
        <RefreshCw className={`h-4 w-4 ${query.isFetching ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  )
}

export function AccountChecker() {
  const { publicKey } = useWallet()
  if (!publicKey) {
    return null
  }
  return <AccountBalanceCheck address={publicKey} />
}

export function AccountBalanceCheck({ address }: { address: PublicKey }) {
  const { cluster } = useCluster()
  const mutation = useRequestAirdrop({ address })
  const query = useGetBalance({ address })

  if (query.isLoading) {
    return null
  }
  if (query.isError || !query.data) {
    return (
      <AppAlert
        action={
          <Button variant="outline" onClick={() => mutation.mutateAsync(1).catch((err) => console.log(err))}>
            Request Airdrop
          </Button>
        }
      >
        You are connected to <strong>{cluster.name}</strong> but your account is not found on this cluster.
      </AppAlert>
    )
  }
  return null
}

export function AccountButtons({ address }: { address: PublicKey }) {
  const { cluster, getExplorerUrl } = useCluster()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg border">
        <Wallet className="h-4 w-4 text-muted-foreground" />
        <code className="text-sm font-mono">{ellipsify(address.toString(), 12)}</code>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyToClipboard} title="Copy address">
          {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
        <a
          href={getExplorerUrl(`account/${address}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center"
          title="View on explorer"
        >
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </a>
      </div>
      {cluster.network?.includes('mainnet') ? null : <ModalAirdrop address={address} />}
    </div>
  )
}

export function AccountTransactions({ address }: { address: PublicKey }) {
  const query = useGetSignatures({ address })
  const [showAll, setShowAll] = useState(false)

  const items = useMemo(() => {
    if (showAll) return query.data
    return query.data?.slice(0, 5)
  }, [query.data, showAll])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle>Transaction History</CardTitle>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => query.refetch()}
            disabled={query.isLoading}
            title="Refresh transactions"
          >
            <RefreshCw className={`h-4 w-4 ${query.isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {query.isError && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Error: {query.error?.message.toString()}</span>
            </div>
          </div>
        )}
        {query.isSuccess && (
          <div>
            {query.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <History className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No transactions found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Signature
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Hash className="h-4 w-4" />
                          Slot
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Block Time
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items?.map((item) => (
                      <TableRow key={item.signature} className="hover:bg-muted/50">
                        <TableCell className="font-mono">
                          <div className="flex items-center gap-2">
                            <ExplorerLink path={`tx/${item.signature}`} label={ellipsify(item.signature, 8)} />
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-right">
                          <div className="flex items-center justify-end gap-2">
                            <ExplorerLink path={`block/${item.slot}`} label={item.slot.toString()} />
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{new Date((item.blockTime ?? 0) * 1000).toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.err ? (
                              <>
                                <XCircle className="h-4 w-4 text-destructive" />
                                <span className="text-destructive font-medium" title={item.err.toString()}>
                                  Failed
                                </span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="text-green-500 font-medium">Success</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(query.data?.length ?? 0) > 5 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                            {showAll ? 'Show Less' : `Show All (${query.data.length})`}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function BalanceSol({ balance }: { balance: number }) {
  return <span>{Math.round((balance / LAMPORTS_PER_SOL) * 100000) / 100000}</span>
}

function ModalAirdrop({ address }: { address: PublicKey }) {
  const mutation = useRequestAirdrop({ address })
  const [amount, setAmount] = useState('2')

  return (
    <AppModal
      title="Request Airdrop"
      trigger={
        <Button variant="default" className="flex items-center gap-2">
          <Coins className="h-4 w-4" />
          Request Airdrop
        </Button>
      }
      submitDisabled={!amount || mutation.isPending}
      submitLabel={mutation.isPending ? 'Requesting...' : 'Request Airdrop'}
      submit={() => mutation.mutateAsync(parseFloat(amount))}
    >
      <div className="space-y-2">
        <Label htmlFor="amount" className="flex items-center gap-2">
          <Coins className="h-4 w-4" />
          Amount (SOL)
        </Label>
        <Input
          disabled={mutation.isPending}
          id="amount"
          min="1"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          step="any"
          type="number"
          value={amount}
        />
      </div>
    </AppModal>
  )
}
