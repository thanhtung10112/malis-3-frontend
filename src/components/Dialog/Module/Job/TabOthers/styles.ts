import { makeStyles } from '@material-ui/core'
import { red } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => {
  return {
    root: {},
    section: {
      marginTop: theme.spacing(1)
    },
    uploadImageSection: {
      height: '100%',
      width: '90%',
      border: '1px dashed gainsboro',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    },
    uploadIcon: {
      fontSize: 36,
      color: '#0A65FF',
      marginBottom: theme.spacing(1)
    },
    uploadDescription: {
      fontSize: 12,
      color: '#606F89'
    },
    marginTopSection: {
      marginTop: theme.spacing(2)
    },
    extendedPropertyTable: {
      marginTop: theme.spacing(2)
    },
    textFieldError: {
      background: red[100]
    }
  }
})

export default useStyles
