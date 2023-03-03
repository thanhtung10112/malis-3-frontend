import React from 'react'
import { DialogMainProps, ExtraButton } from '@/components/Dialog/Main/type'

export interface ButtonItem extends Omit<ExtraButton, 'action' | 'onClick'> {
  action: string
}

export type ConfirmationOptions = {
  title: string
  description: string
  dialogProps: Partial<DialogMainProps>
  buttons: ButtonItem[]
}

export type ConfirmationProps = {
  propsOptions: Partial<ConfirmationOptions>
  children: React.ReactNode
}
