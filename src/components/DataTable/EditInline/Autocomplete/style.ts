import { makeStyles } from '@material-ui/core'
import { red } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      height: '100%',
      width: '100%',
      border: 'none',
      padding: theme.spacing(0, 0.5),
      '& .MuiInputBase-fullWidth': {
        height: '100%',
        border: 'none',
        '& .MuiInputBase-input': {
          height: '100%',
          border: 'none',
          paddingLeft: '0 !important'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none'
        }
      }
    },
    textFieldError: {
      background: red[100]
    }
  }
})

export default useStyles
