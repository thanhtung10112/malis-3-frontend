import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => {
  return {
    document__container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(1),
      opacity: 0.2,
      pointerEvents: 'none'
    },
    document__attach: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 3,
      cursor: 'pointer'
    },
    document__iconText: {
      fontSize: 14
    }
  }
})

export default useStyles
