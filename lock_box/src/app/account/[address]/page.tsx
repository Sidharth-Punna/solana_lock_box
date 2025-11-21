import AccountDetailFeature from '@/components/account/account-detail-feature'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Account',
  description: 'Manage your account and transactions',
}

export default function Page() {
  return <AccountDetailFeature />
}
