import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ReactNode } from 'react'

export function AppModal({
  children,
  title,
  submit,
  submitDisabled,
  submitLabel,
  trigger,
}: {
  children: ReactNode
  title: string | ReactNode
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
  trigger?: ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">{typeof title === 'string' ? title : 'Open'}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{typeof title === 'string' ? title : title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
        <DialogFooter>
          {submit ? (
            <Button type="submit" onClick={submit} disabled={submitDisabled}>
              {submitLabel || 'Save'}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
