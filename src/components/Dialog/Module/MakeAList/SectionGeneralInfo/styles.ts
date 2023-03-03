import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  chkSetAsDefault: {
    padding: 0,
    marginLeft: theme.spacing(1.5)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  timezoneTitle: {
    fontWeight: theme.typography.fontWeightMedium
  }
}))

export default useStyles
