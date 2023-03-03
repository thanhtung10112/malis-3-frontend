import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => {
  return {
    wrapLogin: {
      display: 'flex !important',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    },
    loginTitle: {
      marginTop: theme.spacing(2)
    },
    topIcon: {
      backgroundColor: theme.palette.secondary.main
    },
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'white',
      padding: theme.spacing(3),
      height: '50%',
      borderRadius: 8,
      position: 'relative',
      overflow: 'hidden'
    },
    submitButton: {
      marginTop: theme.spacing(2)
    },
    wrapButton: {
      position: 'relative'
    },
    error: {
      color: theme.palette.error.main,
      marginBottom: theme.spacing(1)
    },
    textField: {
      '&:not(:nth-of-type(2))': {
        margin: theme.spacing(3, 0)
      }
    },
    checkbox: {
      marginTop: theme.spacing(1)
    },
    progress: {
      width: '100%',
      position: 'absolute',
      top: 0
    }
  }
})

export default useStyles
