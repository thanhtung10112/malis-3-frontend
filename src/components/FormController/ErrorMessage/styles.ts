import { makeStyles } from '@material-ui/core'
import { red } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: red[100],
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    border: `1px solid ${red[200]}`,
    fontWeight: theme.typography.fontWeightMedium
  },
  arrow: {
    color: red[200]
  }
}))

export default useStyles
