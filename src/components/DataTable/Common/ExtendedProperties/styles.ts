import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => {
  return {
    placeholder: {
      color: theme.palette.text.hint
    },
    checkbox: {
      padding: 0,
      marginLeft: -2
    },
    textValue: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    disable: {
      opacity: 0.45
    }
  }
})

export default useStyles
