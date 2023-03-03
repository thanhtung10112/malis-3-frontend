import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: '100%',
      padding: theme.spacing(1.5)
    },
    heading: {
      textAlign: 'center',
      width: '100%',
      fontSize: 20,
      fontWeight: 500,
      letterSpacing: 0.15,
      textTransform: 'uppercase'
    },
    table: {
      minWidth: 650
    },
    cellLeft: {
      width: '15%'
    },
    wrapLabelFilter: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(1.5)
    },
    wrapFilterList: {
      marginTop: theme.spacing(1.5),
      '& button': {
        marginTop: theme.spacing(1),
        width: '100%'
      }
    },
    wrapButtonGroup: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing(1)
    },
    wrapButtonLeft: {},
    wrapButtonRight: {},
    wrapSubTitlte: {
      position: 'relative'
    },
    borderLeft: {
      position: 'absolute',
      bottom: 0,
      width: 20,
      height: 2,
      background: 'red'
    },
    defaultFilterLink: {
      // width: '70%',
      maxWidth: 150,
      cursor: 'pointer',
      marginRight: theme.spacing(0.5),
      fontWeight: theme.typography.fontWeightMedium,
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    tabPanel: {
      minHeight: 318,
      maxHeight: 318,
      paddingRight: 15,
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    rootAccordionSummary: {
      // boxShadow: theme.shadows[3],
      '& .MuiAccordionSummary-expandIcon': {
        marginRight: theme.spacing(2)
      }
    },
    closeIcon: {
      position: 'absolute',
      right: 21,
      fontSize: 14,
      top: 15,
      color: 'rgba(0, 0, 0, 0.54)'
    },
    checkboxSetDefault: {
      padding: '0 !important',
      margin: `${theme.spacing(0, 1)} !important`
    },
    labelHeadingsSection: {
      marginBottom: theme.spacing(1.5)
    },
    systemFilter: {
      cursor: 'pointer',
      marginTop: 10,
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    nameColumn: {
      width: 300
    },
    btnCreatePreset: {
      height: 30,
      padding: `${theme.spacing(1)}px !important`
    },
    rootPresetList: {
      position: 'relative',
      paddingRight: '26px !important',
      '& .divider': {
        position: 'absolute',
        right: 0,
        top: 0,
        height: '98%'
      }
    },
    rootPresetDetail: {
      paddingLeft: '20px !important'
    },
    conjuctionRoot: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      // width: 72,
      height: 19,
      fontSize: 11,
      borderRadius: '0 !important'
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none'
    },
    conjuction: {
      width: 36,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(0.5, 1),
      background: theme.palette.common.white,
      '&.active': {
        color: theme.palette.common.white,
        background: '#0A65FF'
      }
    },
    buttonGroup: {
      marginLeft: '0.5rem'
    },
    iconButton: {
      color: '#7D90B2'
    },
    wrapSelect: {
      '& .MuiInputBase-root': {
        height: 24
      }
    },
    filterListTopSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    },
    presetSelected: {
      backgroundColor: '#DAE1EC !important'
    }
  }
})

export default useStyles
