import { makeStyles, Theme } from '@material-ui/core'
import { DialogMainProps } from './type'

const useStyles = makeStyles<Theme, DialogMainProps>((theme) => {
  return {
    root: {
      position: 'relative'
    },
    title: {
      padding: theme.spacing(0.5, 1, 0.5, 2),
      borderBottom: '1px solid #e5e5e5',
      cursor: (props) => (props.draggable ? 'move' : null),
      textTransform: 'capitalize'
    },
    paperRoot: {},
    content: {
      height: (props) => props.height || null,
      // width: (props) => props.width || null,
      // height: (props) => props.height || null,
      margin: theme.spacing(1, 0),
      paddingTop: 0
    },
    closeIcon: {
      position: 'absolute',
      right: '15px',
      top: '10px',
      '&.disabled': {
        color: theme.palette.action.disabled,
        pointerEvents: 'none'
      }
    },
    buttonActions: {
      borderTop: '1px solid #e5e5e5',
      padding: theme.spacing(0.5, 1)
    },
    progress: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%'
    }
  }
})

export default useStyles
