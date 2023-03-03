import React from 'react'
import { InputAdornment } from '@material-ui/core'
import { AppAutocomplete } from '@/components/index'

import useStyles from './styles'
import { CustomAutocompleteProps } from './type'

const AppAutocompleteStyled: React.FC<CustomAutocompleteProps<any>> = (props) => {
  const { width, label, height, ...autocompleteProps } = props

  const classes = useStyles({ height })

  return (
    <AppAutocomplete
      {...autocompleteProps}
      style={{ width }}
      textFieldProps={{
        className: classes.root,
        InputProps: {
          startAdornment: (
            <InputAdornment position="start">
              <span>{label}:</span>
            </InputAdornment>
          )
        }
      }}
    />
  )
}

AppAutocompleteStyled.defaultProps = {
  width: 160,
  height: 40
}

export default AppAutocompleteStyled
