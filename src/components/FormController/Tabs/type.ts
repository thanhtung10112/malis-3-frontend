import React from 'react'
import { UseFormMethods } from 'react-hook-form'

export type ChildTab = {
  label: string
  panel: React.ReactNode
  errorKey?: string[]
  panelProps?: any
  disabled?: boolean
  hide?: boolean
}

export type FormControllerTabProps<T> = {
  tabs: ChildTab[]
  value: string | number
  form: UseFormMethods<T>
  resetTabValue?: boolean
  onChange(event: React.ChangeEvent, value: any): void
}
