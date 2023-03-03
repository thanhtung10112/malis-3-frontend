import { makeStyles } from '@material-ui/core'

import { PAGINATION_HEIGHT } from '@/styles/vars/size'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: PAGINATION_HEIGHT,
      padding: '0 10px'
    },
    rootPageNumber: {
      margin: '0 12px'
    },
    pageList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex'
    },
    pageNumber: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 21,
      width: 23,
      border: 'none',
      background: 'white'
    },
    pageNumberSelected: {
      background: '#7D90B2',
      color: theme.palette.common.white,
      borderRadius: '50%'
    },
    nextPrevIcon: {
      // fontWeight: 6,
      '& svg': {
        fontSize: 30,
        fontWeight: theme.typography.fontWeightMedium,
        color: '#7D90B2'
      }
    },
    nextIcon: {
      marginLeft: theme.spacing(1)
    },
    wrapCountSelected: {
      fontSize: 10,
      color: '#7D90B2',
      fontWeight: theme.typography.fontWeightBold
    },
    wrapControlPaginate: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#7D90B2',
      fontWeight: theme.typography.fontWeightMedium
    },
    choosePerpage: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      marginLeft: 10
    },
    perPage: {
      display: 'flex',
      alignItems: 'center'
    },
    pageNumberItem: {
      fontSize: 12,
      padding: 0,
      width: 30,
      minWidth: 30,
      background: '#7D90B2',
      color: theme.palette.common.white,
      height: 24,
      border: 'none',
      '&:hover': {
        opacity: 0.8,
        backgroundColor: '#7D90B2'
      }
    },
    disabled: {
      cursor: 'not-allowed !important',
      opacity: theme.palette.action.disabledOpacity
    },
    threeDots: {
      marginRight: 6,
      paddingTop: 2
    }
  }
})

export default useStyles
