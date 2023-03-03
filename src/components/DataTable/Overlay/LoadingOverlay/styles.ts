import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  loading__overlay: {
    // background: 'rgba(244, 247, 252, 0.6) !important',
    zIndex: 99
  },
  loading__process: {
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 99
  }
}))

export default useStyles
