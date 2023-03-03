import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => {
  return {
    title: {
      fontWeight: 'bold'
    },
    label: {
      fontWeight: theme.typography.fontWeightBold,
      color: '#7D90B2'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: `${theme.spacing(0, 1, 0, 0)} !important`,
      '& svg:first-child': {
        marginRight: 10
      }
    },
    switchButton: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    chkSetAsDefault: {
      '&:not(:first-child)': {
        padding: 0,
        marginLeft: theme.spacing(1.5),
        marginRight: theme.spacing(1)
      }
    },
    textField: {
      marginTop: theme.spacing(2)
    },
    chipRoot: {
      height: 18,
      fontSize: 13
    },
    chipIcon: {
      width: 14,
      heigt: 14
    }
  }
})

export default useStyles
