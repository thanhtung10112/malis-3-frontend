import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => {
  return {
    wrapDialog: {
      marginTop: theme.spacing(1)
    },
    moreInfo: {
      marginLeft: theme.spacing(0.5),
      color: '#3B71FE',
      cursor: 'pointer'
    },
    browseIcon: {
      width: '100%',
      height: '50%',
      color: '#3B71FE'
    },
    input: {
      width: 0,
      opacity: 0,
      position: 'fixed'
    }
  }
})

export default useStyles
