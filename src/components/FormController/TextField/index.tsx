import React from 'react'
import { useController } from 'react-hook-form'

import { AppTextField } from '@/components/index'

import { ControlledTextFieldProps } from './type'
import _ from 'lodash'

const FormControlledTextField: React.FC<ControlledTextFieldProps> = (props) => {
  const { control, name, defaultValue, rules, transformValue, limitText, ...textFieldProps } = props

  const {
    field: { onChange: onChangeController, value, ...inputProps },
    meta: { invalid }
  } = useController({
    name,
    rules,
    defaultValue,
    control
  })

  const onChangeValue = (event) => {
    const { value } = event.target
    const transformVal = transformValue(value)
    if (limitText && _.size(value) > limitText) {
      return
    }
    onChangeController(transformVal)
  }

  return (
    <AppTextField
      {...inputProps}
      {...(textFieldProps as any)}
      name={name}
      onChange={onChangeValue}
      error={Boolean(invalid)}
      helperText={(invalid as any)?.message}
      value={_.toString(value)}
    />
  )
}

FormControlledTextField.defaultProps = {
  rules: {},
  transformValue: (value) => value,
  limitText: null
}

export default FormControlledTextField
