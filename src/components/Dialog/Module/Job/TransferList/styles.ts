import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    // margin: 'auto'
    width: 800,
    maxWidth: 800,
    height: 512,
    '& .MuiDialogContent-root': {
      padding: 12
    }
  },
  cardHeader: {
    padding: theme.spacing(0.5, 1),
    background: '#F4F7FC'
  },
  cardHeaderTitle: {
    color: '#606F89',
    fontWeight: theme.typography.fontWeightBold
  },
  cardHeaderSubtitle: {
    color: '#606F89'
  },
  list: {
    width: 'auto',
    height: 340,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    padding: 0
  },
  button: {
    margin: theme.spacing(0.5, 0)
  },
  itemList: {
    height: 35,
    paddingLeft: 8,
    paddingRight: 8,
    color: '#606F89',
    '&:nth-child(even)': {
      background: '#F4F7FC'
    },
    '&:hover': {
      background: '#EBF2FF'
    }
  },
  itemText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}))

export default useStyles
