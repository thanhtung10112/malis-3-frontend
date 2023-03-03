import React from 'react'

import { Calendar } from '@material-ui/pickers'
import { DialogMain } from '@/components/index'

import { isValid, parseISO } from 'date-fns'

// import { DialogCalendarProps } from './type'

function DialogCalendar(props) {
  const { date, onChange, minDate, maxDate, ...dialogProps } = props

  const formatDate = React.useMemo(() => {
    if (isValid(parseISO(date))) {
      return new Date(date)
    }
    return new Date()
  }, [date])

  const formatMinDate = React.useMemo(() => {
    if (isValid(parseISO(minDate))) {
      return new Date(minDate)
    }
    return null
  }, [minDate])

  const formatMaxDate = React.useMemo(() => {
    if (isValid(parseISO(maxDate))) {
      return new Date(maxDate)
    }
    return null
  }, [maxDate])

  return (
    <DialogMain maxWidth="xs" closable={false} {...dialogProps}>
      <Calendar date={formatDate} onChange={onChange} minDate={formatMinDate} maxDate={formatMaxDate} />
    </DialogMain>
  )
}

export default DialogCalendar
