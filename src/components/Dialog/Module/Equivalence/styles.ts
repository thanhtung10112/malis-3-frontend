import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    maxWidth: 700
  },
  title: {
    display: 'flex',
    padding: `${theme.spacing(0, 1)} !important`,
    alignItems: 'flex-end'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: `${theme.spacing(0, 1)} !important`,
    '& .MuiButtonBase-root:first-child': {
      marginRight: theme.spacing(1)
    }
  },
  input: {
    width: 0,
    opacity: 0,
    position: 'fixed'
  },
  gridMarginTop: {
    marginTop: 4
  }
}))

export default useStyles
