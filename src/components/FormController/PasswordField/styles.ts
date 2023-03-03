import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  tooltipItem: {
    color: 'rgba(255, 255, 255, 0.74)',
    '&.active': {
      color: 'white'
    }
  }
}))

export default useStyles
