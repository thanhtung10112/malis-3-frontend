import type { AppNumberFieldProps } from '@/components/App/NumberField/type'
import type { UseControllerOptions } from 'react-hook-form'

export interface FormControllerNumberFieldProps
  extends Omit<AppNumberFieldProps, 'name' | 'variant' | 'onChange' | 'defaultValue'>,
    Omit<UseControllerOptions, 'onFocus'> {}
