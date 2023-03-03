import React from 'react'

import type { ButtonProps, DialogProps } from '@material-ui/core'

export interface ExtraButton extends Omit<ButtonProps, 'hidden'> {
  label: string
  hide?: boolean
}

export interface DialogMainProps extends Omit<DialogProps, 'title'> {
  title?: React.ReactNode
  onOk?: React.MouseEventHandler<HTMLButtonElement>
  onClose?: React.MouseEventHandler<HTMLButtonElement>
  description?: string
  children?: React.ReactNode
  extraButtons?: ExtraButton | ExtraButton[]
  closeText?: string
  okText?: string
  closable?: boolean
  height?: number
  loading?: boolean
  enterToOk?: boolean
  okButtonProps?: ButtonProps
  closeButtonProps?: ButtonProps
  bodyStyles?: React.CSSProperties
  hideOkButton?: boolean
  hideCloseButton?: boolean
  hideButtonsAction?: boolean
  type?: 'normal' | 'success' | 'error' | 'info' | 'warning'
  draggable?: boolean
}
