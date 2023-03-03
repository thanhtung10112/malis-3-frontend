import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    marginRight: theme.spacing(1),
    '& .required': {
      color: theme.palette.error.main,
      padding: '0 2px'
    }
  }
}))

export default useStyles
