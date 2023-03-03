import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => {
  return {
    root: {},
    section: {
      marginTop: theme.spacing(2)
    },
    timezoneTitle: {
      fontWeight: theme.typography.fontWeightMedium
    }
  }
})

export default useStyles
