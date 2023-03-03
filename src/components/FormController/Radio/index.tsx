import React from 'react'

import { RadioGroup, FormControlLabel, Radio, Typography } from '@material-ui/core'
import { When } from 'react-if'

import { useController } from 'react-hook-form'
import useStyles from './styles'

import type { FormControllerRadioProps } from './type'

function FormControllerRadio(props: FormControllerRadioProps) {
  const classes = useStyles()
  const { required, label, options, ...formControlProps } = props

  const {
    field: { onChange: onChangeController, value: valueController, ...controllerInputProps }
  } = useController(formControlProps)

  const renderOptions = React.useCallback(() => {
    return options.map(({ value, label, ...radioProps }) => (
      <FormControlLabel
        key={`${label}-${value}`}
        value={value}
        label={label}
        control={<Radio color="primary" {...radioProps} checked={value == valueController} />}
      />
    ))
  }, [options, valueController])

  const handleChangeValue = (_, value) => {
    onChangeController(value)
  }

  return (
    <div className={classes.root}>
      <Typography variant="body1" className={classes.label}>
        {label}
        <When condition={required}>
          <span className="required">*</span>
        </When>
        :
      </Typography>
      <RadioGroup {...controllerInputProps} row aria-label="position" onChange={handleChangeValue}>
        {renderOptions()}
      </RadioGroup>
    </div>
  )
}

export default FormControllerRadio
