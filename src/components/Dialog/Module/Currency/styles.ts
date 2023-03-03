import { makeStyles } from '@material-ui/core/styles'

const FONT_SIZE_ICON = 25

const useStyles = makeStyles((theme) => {
  return {
    gridTop: {
      marginTop: 10
    },
    equalCharacter: {
      display: 'flex',
      justifyContent: 'right',
      marginTop: 5
    },
    currencyChange: {
      marginTop: 5
    },
    wrapContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    wrapSymbol: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    syncAltIcon: {
      fontSize: FONT_SIZE_ICON,
      marginRight: theme.spacing(1)
    },
    symbolEqual: {
      fontSize: FONT_SIZE_ICON,
      marginLeft: theme.spacing(1.5)
    },
    multiplierLabel: {
      marginLeft: theme.spacing(1)
    },
    disabled: {
      opacity: theme.palette.action.disabledOpacity,
      cursor: 'not-allowed'
    }
  }
})

export default useStyles
