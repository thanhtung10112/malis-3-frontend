import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'

import DateFnsUtils from '@date-io/date-fns'

import { FormControllerErrorMessage } from '@/components/index'

import { useController } from 'react-hook-form'

import * as constant from '@/utils/constant'

import type { ControlledDatePickerProps } from './type'

function ControlledDatePicker(props: ControlledDatePickerProps) {
  const { name, control, defaultValue, rules, ...datePickerProps } = props

  const {
    field: { onChange, ...inputProps },
    meta: { invalid }
  } = useController({
    name,
    rules,
    defaultValue,
    control
  })

  const onChangeDate = (date) => {
    onChange(date)
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <FormControllerErrorMessage open={Boolean(invalid)} title={(invalid as any)?.message}>
        <DatePicker {...datePickerProps} {...inputProps} onChange={onChangeDate} />
      </FormControllerErrorMessage>
    </MuiPickersUtilsProvider>
  )
}

ControlledDatePicker.defaultProps = {
  autoOk: true,
  format: constant.DATE_FORMAT
}

export default ControlledDatePicker
