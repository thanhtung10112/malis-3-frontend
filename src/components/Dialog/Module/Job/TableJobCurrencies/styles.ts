import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  currencyTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  currencyOption: {
    marginTop: theme.spacing(1)
  },
  deleteButton: {
    marginRight: theme.spacing(2)
  },
  currencyTable: {
    marginTop: theme.spacing(1.5),
    marginRight: theme.spacing(2)
  }
}))

export default useStyles
