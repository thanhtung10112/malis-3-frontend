import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  all: {
    background: '#F1F3F4',
    borderBottom: '1px solid #E3E5E5'
  },
  treeRoot: {
    fontSize: 12,
    '& .MuiTreeItem-content': {
      '& .MuiTreeItem-label': {
        height: 35,
        display: 'flex',
        alignItems: 'center'
      }
    },
    '& .MuiTreeItem-group': {
      margin: 0
    }
  },
  treeItemParent: {
    borderBottom: '1px solid #E3E5E5',
    background: '#F1F3F4',
    '& .MuiTreeItem-content': {
      paddingLeft: 8
    },
    '&.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label': {
      background: '#F1F3F4',
      '&:hover': {
        background: '#E3E5E5'
      }
    },
    '&.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover': {
      background: '#E3E5E5'
    }
  },
  treeItemChild: {
    '&:hover': {
      background: 'red !important'
    },
    '& .MuiTreeItem-content': {
      paddingLeft: 33,
      background: '#E3E5E5'
    }
  }
})

export default useStyles
