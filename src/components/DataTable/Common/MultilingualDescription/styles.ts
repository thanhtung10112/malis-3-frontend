import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  rteRoot: {
    width: '100%',
    height: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  disable: {
    opacity: 0.45
  }
}))

export default useStyles
