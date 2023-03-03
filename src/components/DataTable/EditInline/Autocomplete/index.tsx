import { AppAutocomplete } from '@/components'

import useStyles from './style'

import type { DataTableAutocompleteProps } from './type'

const DataTableAutocomplete: React.FC<DataTableAutocompleteProps> = (props) => {
  const { params, onChange, ...autoCompleteProps } = props

  const { api, id, field, value } = params

  const classes = useStyles()

  const handleChange = (event, optionValue, reason) => {
    api.setCellMode(id, field, 'view')
    onChange(event, optionValue, reason)
  }

  return (
    <AppAutocomplete
      value={value}
      disableClearable={false}
      className={classes.root}
      onChange={handleChange}
      textFieldProps={{ autoFocus: true }}
      renderOption={(option) => option?.description}
      {...autoCompleteProps}
    />
  )
}

export default DataTableAutocomplete
