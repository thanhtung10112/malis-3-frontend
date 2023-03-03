import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    rectangle: {
      width: 3,
      height: 22,
      marginRight: 12
    },
    label: {
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      color: '#7D90B2',
      textTransform: 'uppercase'
    }
  }
})

export default useStyles
