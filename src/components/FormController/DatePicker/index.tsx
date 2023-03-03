import { AppDatePicker } from '@/components/index'

import { useController } from 'react-hook-form'

// import type { FormControllerDatePickerProps } from './type'

function FormControllerDatePicker(props) {
  const { control, name, ...datePickerProps } = props
  const {
    field: { onChange, value },
    meta: { invalid }
  } = useController({ name, control })

  return (
    <AppDatePicker
      {...datePickerProps}
      error={Boolean(invalid)}
      helperText={(invalid as any)?.message}
      name={name}
      value={value}
      onChange={onChange}
    />
  )
}

export default FormControllerDatePicker
