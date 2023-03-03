import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 1),
    marginTop: theme.spacing(1)
  },
  timezoneTitle: {
    fontWeight: theme.typography.fontWeightMedium
  }
}))

export default useStyles
