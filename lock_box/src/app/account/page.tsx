import AccountListFeature from '@/components/account/account-list-feature'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account LockBox',
  description: 'Manage your account and transactions',
}

export default function Page() {
  return <AccountListFeature />
}
