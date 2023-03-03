import * as _ from 'lodash'

import { Select, MenuItem, FormControl } from '@material-ui/core'

import useStyles from '../styles'

// Conjunction, column name, comparator DD and value fields
// Those components will be used in the rules and groups

function ComparatorOptions({ rules, columnOptions, options, disabled, onComparatorChange }) {
  const selectedColumn = _.find(columnOptions, { id: rules.id })

  const classes = useStyles()

  const menuItems = []
  let i = 0
  for (const comparator of options) {
    if (comparator.for_type.includes(selectedColumn.column_type)) {
      menuItems.push(
        <MenuItem value={comparator.value} key={`${comparator.value}-${i}`}>
          {comparator.description}
        </MenuItem>
      )
      i++
    }
  }

  const handleComparatorChange = (event) => {
    // rules.comparator = event.target.value
    onComparatorChange(event.target.value)
    // forceRerender()
  }

  return (
    <>
      <FormControl
        variant="outlined"
        size="small"
        style={{ marginRight: '0.8rem', width: '10rem' }}
        className={classes.wrapSelect}
      >
        <Select disabled={disabled} value={rules.comparator} onChange={handleComparatorChange}>
          {menuItems}
        </Select>
      </FormControl>
    </>
  )
}

export default ComparatorOptions
