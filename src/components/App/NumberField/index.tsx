import { forwardRef } from 'react'
import NumberFormat from 'react-number-format'

import { AppTextField } from '@/components'

import type { AppNumberFieldProps } from './type'

const AppNumberField: React.FC<AppNumberFieldProps> = forwardRef((props, ref) => {
  const { onChange, ...numberFieldProps } = props

  return (
    <NumberFormat {...(numberFieldProps as any)} customInput={AppTextField} onValueChange={onChange} ref={ref as any} />
  )
})

AppNumberField.defaultProps = {
  thousandSeparator: ' ',
  allowNegative: false,
  decimalScale: 2,
  fixedDecimalScale: 2
}

export default AppNumberField
