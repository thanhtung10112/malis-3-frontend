import { InputAdornment } from '@material-ui/core'
import { AppAutocompleteAsync } from '@/components/index'

import useStyles from '../AutocompleteStyled/styles'

import type { AppAutocompleteStyledAsyncProps } from './type'

const AutocompleteStyledAsync: React.FC<AppAutocompleteStyledAsyncProps> = (props) => {
  const { width, height, label, ...autocompleteProps } = props

  const classes = useStyles({ height })

  return (
    <AppAutocompleteAsync
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

AutocompleteStyledAsync.defaultProps = {
  width: 160,
  height: 40
}

export default AutocompleteStyledAsync
