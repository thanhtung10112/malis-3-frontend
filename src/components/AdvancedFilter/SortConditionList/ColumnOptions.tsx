import { useState } from 'react'

import { FormControl, TextField } from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab'

import * as _ from 'lodash'

// column name and sort condition DD and value fields
function ColumnOptions({ columnOptions, condition: currentCondition, conditionData, disabled }) {
  // trick for forcing rerender
  const [, setValue] = useState(0)
  const forceRerender = () => {
    setValue((value) => value + 1)
  }

  const filterColumnOptions = (options, state) => {
    const selectedColumns = conditionData.map((cond) => cond.id)
    const new_options = _.filter(options, (op) => {
      return (
        !selectedColumns.includes(op.id) &&
        (op.id?.toLowerCase().includes(state.inputValue.toLowerCase()) ||
          op.description?.toLowerCase().includes(state.inputValue.toLowerCase()))
      )
    })
    return new_options
  }

  const onSelectedColumnChange = (selectedColumn) => {
    currentCondition.id = selectedColumn.id
    forceRerender()
  }

  return (
    <>
      <FormControl style={{ marginRight: '0.5rem' }}>
        <Autocomplete
          options={columnOptions}
          value={_.find(columnOptions, {
            id: currentCondition.id
          })}
          getOptionLabel={(option) => option.description}
          // getOptionSelected={(option) => option.}
          style={{ width: '15rem' }}
          disableClearable
          filterOptions={(options, state) => filterColumnOptions(options, state)}
          renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
          onChange={(e, selectedColumn) => onSelectedColumnChange(selectedColumn)}
          disabled={disabled}
        />
      </FormControl>
    </>
  )
}

export default ColumnOptions
