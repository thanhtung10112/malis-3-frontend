import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => {
  return {
    rootList: {
      padding: 0,
      border: theme.shape.borderRadius,
      maxHeight: 340,
      overflowY: 'auto',
      marginTop: theme.spacing(2)
    },
    listItem: {
      height: 30,
      position: 'relative',
      '& div:first-child': {
        width: 40
      },
      '&:nth-child(even)': {
        backgroundColor: '#F4F7FC'
      },
      '&:hover': {
        background: '#EBF2FF'
      }
    },
    header: {
      backgroundColor: '#F4F7FC',
      color: '#606F89'
    },
    expeditionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(2)
    },
    buttonGroup: {
      display: 'flex',
      alignItems: 'center',
      '& svg:first-child': {
        marginRight: 12
      }
    },
    datePicker: {
      height: '100%',
      border: 'none',
      '& .MuiInputBase-fullWidth': {
        height: '100%',
        border: 'none',
        '& .MuiInputBase-input': {
          height: '100%',
          border: 'none',
          paddingLeft: '0 !important'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none'
        }
      }
    },
    dragIcon: {
      position: 'absolute',
      right: 6
    },
    disabled: {
      opacity: theme.palette.action.disabledOpacity,
      userSelect: 'none',
      cursor: 'pointer'
    }
  }
})

export default useStyles
