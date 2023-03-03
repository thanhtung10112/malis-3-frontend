import { makeStyles } from '@material-ui/core'
import { blue } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
  infoOptionTab: {
    marginLeft: theme.spacing(1),
    cursor: 'pointer',
    color: blue[400]
  }
}))

export default useStyles
