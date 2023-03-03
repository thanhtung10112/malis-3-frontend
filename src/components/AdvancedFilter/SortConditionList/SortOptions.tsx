import { useState } from 'react'
import { Select, MenuItem, FormControl } from '@material-ui/core'

import useStyles from '../styles'

function SortOptions({ sortOptions, condition: currentCondition, disabled }) {
  // trick for forcing rerender
  const [, setValue] = useState(0)
  const forceRerender = () => {
    setValue((value) => value + 1)
  }

  const classes = useStyles()

  const menuItems = []
  for (const sortOp of sortOptions) {
    menuItems.push(<MenuItem value={sortOp.value}>{sortOp.description}</MenuItem>)
  }

  const handleSortOptionsChange = (event) => {
    currentCondition.direction = event.target.value
    forceRerender()
  }

  return (
    <>
      <FormControl
        disabled={disabled}
        variant="outlined"
        size="small"
        style={{ width: '10rem' }}
        className={classes.wrapSelect}
      >
        <Select value={currentCondition.direction} onChange={handleSortOptionsChange}>
          {menuItems}
        </Select>
      </FormControl>
    </>
  )
}

export default SortOptions
