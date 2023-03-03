import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  buttonsGeneral: {
    display: 'flex',
    justifyContent: 'space-between',
    '& a': {
      cursor: 'pointer'
    }
  },
  hideEl: {
    display: 'none'
  },
  buttonGroupRoot: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(1)
  }
}))

export default useStyles
