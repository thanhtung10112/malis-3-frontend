import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  icon: {
    cursor: 'pointer'
  },
  disabled: {
    opacity: theme.palette.action.disabledOpacity,
    pointerEvents: 'none'
  }
}))

export default useStyles
