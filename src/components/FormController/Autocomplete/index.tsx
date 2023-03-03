import React from 'react'

import { makeStyles } from '@material-ui/core'
import { useController } from 'react-hook-form'

import { AppAutocomplete } from '@/components/index'

import _ from 'lodash'

import type { FormControllerAutocompleteProps } from './type'

const useStyles = makeStyles(() => ({
  popper: {
    zIndex: 9999999
  }
}))

const FormControllerAutocomplete: React.FC<FormControllerAutocompleteProps> = (props) => {
  const classes = useStyles()
  const {
    control,
    defaultValue,
    name,
    rules,
    primaryKeyOption,
    onChange: onChangeProps,
    textFieldProps,
    ...autocompleteProps
  } = props

  const {
    field: { onChange, ...inputProps },
    meta: { invalid }
  } = useController({
    name,
    rules,
    defaultValue,
    control
  })

  const onChangeValue = (event, value) => {
    if (_.isNil(value)) {
      onChange(null)
      return
    }
    onChange(value[primaryKeyOption])

    if (_.isFunction(onChangeProps)) {
      onChangeProps(value)
    }
  }

  return (
    <AppAutocomplete
      {...autocompleteProps}
      {...inputProps}
      classes={{ ...classes }}
      helperText={(invalid as any)?.message}
      error={Boolean(invalid)}
      onChange={onChangeValue}
      textFieldProps={{ name: name, ...textFieldProps }}
      primaryKeyOption={primaryKeyOption}
    />
  )
}

FormControllerAutocomplete.defaultProps = {
  primaryKeyOption: 'id'
}

export default FormControllerAutocomplete
