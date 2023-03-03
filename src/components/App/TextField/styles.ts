import { makeStyles } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'

export default makeStyles((theme) => ({
  appTextField__generateIcon: {
    height: '3em',
    color: theme.palette.common.white,
    backgroundColor: grey[600],
    cursor: 'pointer'
  },
  appTextField__generateIcon__disabled: {
    opacity: 0.3
  }
}))
