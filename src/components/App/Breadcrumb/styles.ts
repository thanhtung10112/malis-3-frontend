import { makeStyles } from '@material-ui/core/styles'

import { BREADCRUMB_MARGIN_VERTICAL, BREADCRUMB_HEIGHT } from '@/styles/vars/size'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      margin: `${BREADCRUMB_MARGIN_VERTICAL}px 0`,
      minHeight: BREADCRUMB_HEIGHT
    },
    list: {
      display: 'flex',
      marginLeft: 12
    },
    item: {
      color: theme.palette.common.black,
      opacity: theme.palette.action.disabledOpacity,
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    helpIcon: {
      marginLeft: 5,
      fontSize: 20
    },
    lastItem: {
      opacity: 1
    }
  }
})

export default useStyles
