import { CustomDatePickerProps } from '@/components/App/DatePicker/type'
import type { UseControllerOptions } from 'react-hook-form'

export interface FormControllerDatePickerProps
  extends Omit<UseControllerOptions, 'name'>,
    Omit<CustomDatePickerProps, 'value' | 'onChange'> {}
