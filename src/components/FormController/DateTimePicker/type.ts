import type { StandardTextFieldProps } from '@material-ui/core'
import type { UseControllerOptions } from 'react-hook-form'

import { DatePickerProps } from '@material-ui/pickers'

export interface ControlledDatePickerProps
  extends Omit<StandardTextFieldProps, 'name' | 'onChange' | 'onError' | 'value' | 'variant'>,
    Omit<UseControllerOptions, 'onFocus'>,
    Omit<DatePickerProps, 'name' | 'InputProps' | 'onChange' | 'value'> {}
