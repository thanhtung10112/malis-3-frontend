import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => {
  return {
    root: {
      '& fieldset': {
        border: 'none',
        background: '#DAE1EC'
      },
      '& .MuiInputBase-root': {
        padding: '0 !important',
        paddingLeft: '8px !important',
        height: (props: any) => props.height,
        '& .MuiInputAdornment-root': {
          zIndex: 10
        },
        '& .MuiInputBase-input': {
          zIndex: 10,
          paddingLeft: '0 !important'
        },
        '& .MuiAutocomplete-endAdornment': {
          zIndex: 10,
          top: 'calc(50% - 12px)'
        }
      }
    }
  }
})

export default useStyles
