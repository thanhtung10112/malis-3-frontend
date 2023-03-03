import React from 'react'

import { TextField, InputAdornment } from '@material-ui/core'
import DateRangeIcon from '@material-ui/icons/DateRange'

// import DialogCalendar from '../DialogCalendar'
import { DialogCalendar, FormControllerErrorMessage } from '@/components/index'

import { isValid, parseISO, format } from 'date-fns'
import _ from 'lodash'
import * as constant from '@/utils/constant'

import { useToggle } from 'react-use'
import useStyles from './styles'

// import type { CustomDatePickerProps } from './type'

function DatePicker(props) {
  const { value, onChange, minDate, maxDate, helperText, error, ...datePickerProps } = props
  const classes = useStyles()

  const [dateValue, setDateValue] = React.useState('')
  const [openCalendar, setOpenCalendar] = React.useState(false)

  const [isFocusing, setIsFocusing] = useToggle(false)

  const openTooltip = React.useMemo(() => isFocusing && error, [error, isFocusing])

  /**
   * The function used to check valid date
   * @param {String} date
   * @return {boolean}
   */
  const isValidDate = (date) => {
    return isValid(parseISO(date))
  }

  React.useEffect(() => {
    setDateValue(value)
  }, [value])

  const onHoverField = () => {
    setIsFocusing(true)
  }

  const onLeavingField = () => {
    setIsFocusing(false)
  }

  const addZero = (value) => {
    const splitMonth = value.toString().split('')
    if (splitMonth.length === 2) {
      return value
    }
    return `0${splitMonth}`
  }

  const getSymbol = (date) => {
    if (date.includes('-')) {
      return '-'
    } else if (date.includes('/')) {
      return '/'
    } else {
      return '.'
    }
  }

  /**
   * Build a date string based on symbols ("/", ".", "-")
   * @param {String} date
   * @return {String} ex: 2021-07-01 (yyyy-MM-dd)
   */
  const buildDate = (date) => {
    const symbol = getSymbol(date)
    const splitDate = date.split(symbol) // 2021-07-02 => [2021, 07, 02]
    // case user input full values
    if (splitDate.length === 3 && symbol === '-') {
      return format(new Date(date), constant.DATE_FORMAT)
    }
    if (splitDate.length === 3 && symbol !== '-') {
      const newDate = date.split(symbol).reverse().join(symbol)
      return format(new Date(newDate), constant.DATE_FORMAT)
    }
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    let month
    let day
    if (splitDate.length === 2) {
      // case user input two values,
      // ex1: 02-01 => month = 02, day = 01
      // ex2: 02/01 => month = 01, day = 02
      // ex3: 02.01 => month = 01, day = 02
      month = symbol === '-' ? splitDate[0] : splitDate[1]
      day = symbol === '-' ? splitDate[1] : splitDate[0]
    } else {
      // case user input single value, then we will get the month in the current date
      month = currentDate.getMonth() + 1
      day = date
    }
    return `${year}-${addZero(month)}-${addZero(day)}`
  }

  const handleTransformValue = (event) => {
    const value = _.trim(event.target.value)
    let date = value
    if (constant.REGEX_VALID_DATE_EUROPE.test(value) || constant.REGEX_VALID_DATE_ASIA.test(value)) {
      date = buildDate(value)
    }
    if (isValidDate(date)) {
      setDateValue(date)
      onChange(date)
    } else {
      setDateValue(value)
      onChange(value)
    }
  }

  const handleChangeValue = (event) => {
    setDateValue(event.target.value)
  }

  const handleOpenCalendar = () => {
    setOpenCalendar(true)
  }

  const handleCloseCalendar = () => {
    setOpenCalendar(false)
  }

  const handleChangeDate = (nextDate) => {
    const dateFormat = format(nextDate, constant.DATE_FORMAT)
    onChange(dateFormat)
    handleCloseCalendar()
  }

  return (
    <>
      <FormControllerErrorMessage title={helperText} open={openTooltip}>
        <TextField
          {...datePickerProps}
          error={error}
          onMouseOver={onHoverField}
          onMouseLeave={onLeavingField}
          value={dateValue}
          onChange={handleChangeValue}
          onBlur={handleTransformValue}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <DateRangeIcon className={classes.icon} onClick={handleOpenCalendar} />
              </InputAdornment>
            )
          }}
        />
      </FormControllerErrorMessage>
      <DialogCalendar
        open={openCalendar}
        date={dateValue}
        onChange={handleChangeDate}
        onClose={handleCloseCalendar}
        minDate={minDate}
        maxDate={maxDate}
      />
    </>
  )
}

export default DatePicker
