import { FormControlLabel, Checkbox } from '@material-ui/core'

import { useController } from 'react-hook-form'

import { ControlledCheckboxProps } from './type'
import useStyles from './styles'

function ControlledChecbox(props: ControlledCheckboxProps) {
  const classes = useStyles()
  const { control, name, rules, defaultValue, color, ...checkboxProps } = props

  const {
    field: { onChange, value, ...inputProps }
  } = useController({
    name,
    rules,
    defaultValue,
    control
  })

  const onChangeCheckbox = (_, checked) => {
    onChange(checked)
  }

  return (
    <FormControlLabel
      {...checkboxProps}
      classes={{ label: classes.labelCheckbox }}
      control={<Checkbox {...inputProps} color={color} classes={classes} checked={value} onChange={onChangeCheckbox} />}
    />
  )
}

ControlledChecbox.defaultProps = {
  color: 'primary'
}

export default ControlledChecbox
