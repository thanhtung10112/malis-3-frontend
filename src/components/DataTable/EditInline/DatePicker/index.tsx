import React from 'react'

import { MuiPickersUtilsProvider, DatePicker, DatePickerProps } from '@material-ui/pickers'

import DateFnsUtils from '@date-io/date-fns'

import clsx from 'clsx'

import useStyles from './styles'

import { GridCellParams } from '@material-ui/data-grid'

export interface DataTableDatePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
  params: GridCellParams
  onChangeValue(id, value): void
}

const DEFAULT_PROPS = {
  animateYearScrolling: true,
  autoOk: true,
  format: 'yyyy-MM-dd'
}

function DataTableDatePicker(props: DataTableDatePickerProps) {
  const classes = useStyles()

  const { params, className, onChangeValue, ...restProps } = props
  const buildProps = { ...DEFAULT_PROPS, ...restProps }

  const { id, value } = params
  const [openDatePicker, setOpenDatePicker] = React.useState(false)

  const onOpenDatePicker = () => {
    setOpenDatePicker(true)
  }

  const onCloseDatePicker = () => {
    setOpenDatePicker(false)
  }

  const onChangeDate = React.useCallback(
    (date) => {
      props.onChangeValue(id, date)
    },
    [id, value]
  )

  return (
    <>
      <div className={clsx(classes.root, className)} onDoubleClick={onOpenDatePicker}>
        {value}
      </div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          {...buildProps}
          className={classes.datePicker}
          open={openDatePicker}
          value={value as any}
          onChange={onChangeDate}
          onClose={onCloseDatePicker}
        />
      </MuiPickersUtilsProvider>
    </>
  )
}

export default DataTableDatePicker
