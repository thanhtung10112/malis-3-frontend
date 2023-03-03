import type { UseControllerOptions } from 'react-hook-form'
import type { AppTextFieldProps } from '@/components/App/TextField/type'

export interface ControlledTextFieldProps
  extends Omit<AppTextFieldProps, 'name' | 'variant'>,
    Omit<UseControllerOptions, 'onFocus'> {
  transformValue?(value): any
  limitText?: number
  variant?: 'filled' | 'outlined' | 'standard'
  control: any
}
