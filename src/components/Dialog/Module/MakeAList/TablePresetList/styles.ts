import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  btnCreatePreset: {
    height: 30,
    padding: theme.spacing(1)
  },
  filterListTopSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },

  wrapLabelFilter: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5)
  },
  defaultFilterLink: {
    maxWidth: 150,
    cursor: 'pointer',
    marginRight: theme.spacing(0.5),
    fontWeight: theme.typography.fontWeightMedium,
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  presetSelected: {
    backgroundColor: '#DAE1EC !important'
  }
}))

export default useStyles
