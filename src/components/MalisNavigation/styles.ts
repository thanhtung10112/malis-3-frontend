import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => {
  return {
    navigation: {
      display: 'flex',
      height: '100%'
    },
    navigationItem: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 2.5),
      position: 'relative',
      cursor: 'pointer',
      color: '#303030',
      height: '100%',
      opacity: 0.58
    },
    active: {
      opacity: 1,
      '&::after': {
        content: '""',
        position: 'absolute',
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        width: '100%',
        right: '-5%',
        bottom: 0
      }
    },
    dropdownIcon: {
      position: 'absolute',
      right: 2,
      top: '32%',
      '& svg': {
        fontSize: '1rem'
      }
    },
    dropdownList: {
      padding: theme.spacing(0, 1),
      listStyleType: 'none'
    },
    dropdownItem: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      cursor: 'pointer',
      '&:not(:first-child)': {
        paddingTop: theme.spacing(1.5)
      }
    },
    label: {
      letterSpacing: 0.5,
      textTransform: 'capitalize'
    }
  }
})

export default useStyles
