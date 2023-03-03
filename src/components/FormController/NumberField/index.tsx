import { AppNumberField } from '@/components'

import { useController } from 'react-hook-form'

import _ from 'lodash'

import type { FormControllerNumberFieldProps } from './type'
import type { NumberFormatValues } from 'react-number-format'

const FormControllerNumberField: React.FC<FormControllerNumberFieldProps> = (props) => {
  const { control, name, defaultValue, rules, isNumericString, ...numberFieldProps } = props

  const {
    field: { onChange: onChangeController, value, ...inputProps },
    meta: { invalid }
  } = useController({
    name,
    rules,
    defaultValue,
    control
  })

  const handleChangeValue = (params: NumberFormatValues) => {
    const value = isNumericString ? params.value : params.floatValue
    onChangeController(value)
  }

  return (
    <AppNumberField
      {...inputProps}
      {...numberFieldProps}
      isNumericString={isNumericString}
      name={name}
      onChange={handleChangeValue}
      error={Boolean(invalid)}
      helperText={(invalid as any)?.message}
      value={_.toString(value)}
    />
  )
}

export default FormControllerNumberField
