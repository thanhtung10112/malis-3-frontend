import { Select, MenuItem, FormControl } from '@material-ui/core'

import useStyles from '../styles'

function ColumnOptions({ options, value, onColumnNameChange, disabled }) {
  const selectedOptions = value

  const classes = useStyles()

  const menuItems = []
  let i = 0
  for (const column of options) {
    menuItems.push(
      <MenuItem value={column.id} key={`${column.id}-${i}`}>
        {column.description}
      </MenuItem>
    )
    i++
  }

  const handleColumnNameChange = (event) => {
    onColumnNameChange(event.target.value)
  }

  return (
    <>
      <FormControl
        variant="outlined"
        size="small"
        style={{ marginRight: '0.8rem', width: '10rem' }}
        className={classes.wrapSelect}
      >
        <Select disabled={disabled} value={selectedOptions} onChange={handleColumnNameChange}>
          {menuItems}
        </Select>
      </FormControl>
    </>
  )
}

export default ColumnOptions
