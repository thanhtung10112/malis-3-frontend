import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  searchBar__container: {
    display: 'flex',
    alignItems: 'center'
  },
  searchBar__form: {
    display: 'flex',
    alignItems: 'center',
    padding: '2px 4px',
    height: 40,
    background: '#DAE1EC',
    marginLeft: 5
  },
  searchBar__input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: '#2E3B52'
  },
  searchBar__searchIcon: {
    padding: 10,
    color: '#7D90B2',
    '& svg': {
      fontSize: 25
    }
  },
  searchBar__filterIcon: {
    fontSize: 25,
    color: '#0A65FF',
    marginRight: theme.spacing(2.2)
  },
  searchBar__disabled: {
    color: theme.palette.action.disabled
  }
}))

export default useStyles
