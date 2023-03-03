import { useState } from 'react'

import { format as formatDate } from 'date-fns'

import { MuiPickersUtilsProvider, DatePicker, DateTimePicker } from '@material-ui/pickers'

import DateFnsUtils from '@date-io/date-fns'

import { FormControl, TextField, Switch } from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab'

import * as _ from 'lodash'

function ConditionValue({ rules, columnOptions, disabled }) {
  // const [selectedDate, handleDateChange] = useState(new Date());

  // const columns = useSelector(advancedSearchActions.selectColumn) // take this from store
  // const comparatorList = comparators // take this from store

  // trick for forcing rerender
  const [, setValue] = useState(0)
  const forceRerender = () => {
    setValue((value) => value + 1)
  }

  const selectedCol = _.find(columnOptions, { id: rules.id })

  const handleValueChange = (event) => {
    rules.value = event.target.value
    forceRerender()
  }

  const handleDateChange = (value) => {
    rules.value = formatDate(value, 'yyyy-MM-dd')
    forceRerender()
  }

  const handleDateTimeChange = (value) => {
    rules.value = formatDate(value, 'yyyy-MM-dd HH:mm')
    forceRerender()
  }

  const handleBooleanChange = () => {
    rules.value = !rules.value
    forceRerender()
  }

  const onMultiSelectChange = (selectedValues) => {
    rules.value = selectedValues.map((selected) => selected.value)
    forceRerender()
  }

  let valueComponent = <></>
  if (['null', 'nnull'].includes(rules.comparator)) {
    valueComponent = <></>
  } else {
    switch (selectedCol.column_type) {
      case 'string':
        rules.value = rules.value || ''
        valueComponent = (
          <TextField
            variant="outlined"
            size="small"
            type="text"
            fullWidth={false}
            value={rules.value}
            onChange={handleValueChange}
            style={{ width: '15rem' }}
            disabled={disabled}
          />
        )
        break
      case 'number':
        rules.value = rules.value || 0
        valueComponent = (
          <TextField
            variant="outlined"
            size="small"
            type="number"
            value={rules.value}
            fullWidth={false}
            onChange={handleValueChange}
            style={{ width: '15rem' }}
            disabled={disabled}
          />
        )
        break
      case 'boolean':
        rules.value = rules.value || false
        valueComponent = (
          <>
            <FormControl style={{ marginTop: '0.5rem' }}>disable</FormControl>
            <FormControl style={{}}>
              <Switch
                checked={rules.value}
                onClick={handleBooleanChange}
                color="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
                disabled={disabled}
              />
            </FormControl>
            <FormControl style={{ marginTop: '0.5rem' }}>enable</FormControl>
          </>
        )
        break
      case 'date':
        rules.value = rules.value || formatDate(new Date(), 'yyyy-MM-dd')
        valueComponent = (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              value={rules.value}
              inputVariant="outlined"
              size="small"
              onChange={handleDateChange}
              animateYearScrolling
              format="yyyy-MM-dd"
              autoOk
              fullWidth={false}
              style={{ width: '15rem' }}
              disabled={disabled}
            />
          </MuiPickersUtilsProvider>
        )
        break
      case 'datetime':
        rules.value = rules.value || formatDate(new Date(), 'yyyy-MM-dd HH:mm')
        valueComponent = (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              value={rules.value}
              inputVariant="outlined"
              size="small"
              onChange={handleDateTimeChange}
              animateYearScrolling
              format="yyyy-MM-dd HH:mm"
              ampm={false}
              autoOk
              fullWidth={false}
              style={{ width: '15rem' }}
              disabled={disabled}
            />
          </MuiPickersUtilsProvider>
        )
        break
      case 'predefined_value':
        rules.value = rules.value || []
        valueComponent = (
          <Autocomplete
            multiple
            limitTags={2}
            value={rules.value.map((value) => _.find(selectedCol.value_list, { value }))}
            size="small"
            style={{ width: '15rem' }}
            options={selectedCol.value_list}
            getOptionLabel={(option) => option.description}
            disableClearable
            renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
            onChange={(e, selectedOptions) => onMultiSelectChange(selectedOptions)}
            disabled={disabled}
          />
        )
        break
      default:
        valueComponent = <></>
        break
    }
  }

  return valueComponent
}

export default ConditionValue
