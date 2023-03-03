import type { NumberFormatPropsBase, NumberFormatValues } from 'react-number-format'
import type { AppTextFieldProps } from '@/components/App/TextField/type'

export type NumberFormatProps = Omit<NumberFormatPropsBase, 'onChange' | 'fixedDecimalScale' | 'thousandSeparator'>

export type TextFieldProps = Pick<
  AppTextFieldProps,
  | 'name'
  | 'label'
  | 'required'
  | 'error'
  | 'helperText'
  | 'InputProps'
  | 'generateCode'
  | 'onGenerateCode'
  | 'disabled'
  | 'loading'
>

export interface AppNumberFieldProps extends NumberFormatProps, TextFieldProps {
  onChange(values: NumberFormatValues): void
  fixedDecimalScale?: boolean | number
  thousandSeparator?: boolean | string
}
