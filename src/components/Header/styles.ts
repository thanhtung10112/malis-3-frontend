import { makeStyles } from '@material-ui/core/styles'

import { APP_BAR_HEIGHT } from '@/styles/vars/size'

const useStyles = makeStyles((theme) => {
  return {
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: APP_BAR_HEIGHT,
      flexDirection: 'row',
      backgroundColor: theme.palette.common.white,
      boxShadow: 'none',
      color: theme.palette.common.black,
      padding: theme.spacing(0, 1.5)
    },
    profile: {
      display: 'flex',
      alignItems: 'center',
      maxWidth: 120,
      color: 'black',
      fontWeight: 500,
      cursor: 'pointer'
    },
    profile__avatar: {
      width: 18,
      height: 18,
      marginRight: 5
    },
    profile__info: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    profile__loading: {
      display: 'flex',
      alignItems: 'center',
      maxWidth: 120,
      cursor: 'pointer',
      marginLeft: 12
    },
    dropdownList: {
      padding: theme.spacing(1.5, 2.5),
      cursor: 'pointer'
    }
  }
})

export default useStyles
