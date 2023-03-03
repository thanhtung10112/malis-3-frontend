import type { RadioProps } from '@material-ui/core'

// import type { StandardTextFieldProps } from '@material-ui/core'
import type { UseControllerOptions } from 'react-hook-form'

export interface RadioOptions extends Omit<RadioProps, 'onClick' | 'onChange'> {
  label: string
  value: string | number
}

export interface FormControllerRadioProps extends UseControllerOptions {
  options: RadioOptions[]
  label?: string
  required?: boolean
}
