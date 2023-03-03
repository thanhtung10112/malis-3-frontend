import type { DialogMainProps } from '@/components/Dialog/Main/type'

export interface DialogCalendarProps extends Omit<DialogMainProps, 'onChange'> {
  date: string
  onChange?(date: Date): void
}
