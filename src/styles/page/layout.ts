import { makeStyles, darken } from '@material-ui/core/styles'
import { red, blue } from '@material-ui/core/colors'

import { CONTROL_HEIGHT } from '@/styles/vars/size'

const useStyles = makeStyles((theme) => {
  return {
    main: {
      margin: theme.spacing(0, 1.5)
    },
    buttonControls: {
      '& button:not(:first-child)': {
        marginLeft: theme.spacing(1.5)
      }
    },
    controls: {
      padding: theme.spacing(0, 0, 1.2)
    },
    fullWidth: {
      width: '100%'
    },
    officeColumn: {
      display: 'flex'
    },
    control: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: CONTROL_HEIGHT,
      padding: theme.spacing(0, 1.4),
      background: '#F4F7FC'
    },
    wrapControl: {
      display: 'flex',
      alignItems: 'center'
    },
    controlAutocomplete: {
      marginLeft: theme.spacing(3)
    },
    equivalence: {
      fontWeight: theme.typography.fontWeightBold
    },
    tableFooterBudget: {
      flexGrow: 1
    },
    cellFooterBudget: {
      marginLeft: '7px'
    },
    cellFooterDescBudget: {
      padding: '0px 10px'
    },
    buttonControl: {
      // color: theme.palette.common.white,
      fontSize: 12,
      padding: 2,
      textTransform: 'capitalize',
      '&:not(:first-child)': {
        marginLeft: 8
      }
    },
    standard: {
      '& .MuiDataGrid-cellCheckbox': {
        visibility: 'hidden'
      }
    },
    totalBudgetRow: {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.body1.fontSize,
      borderTop: '1.5px solid #DAE1EC',
      '&:hover': {
        backgroundColor: 'transparent !important'
      },
      '& .MuiDataGrid-cellCheckbox': {
        opacity: 0
      },
      '& .MuiDataGrid-cell:nth-child(2)': {
        opacity: 0
      }
    },
    mark: {
      position: 'relative',
      '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: `5px solid ${red[200]}`,
        transform: 'rotate(225deg)'
      }
    },
    permissionItem: {
      '&:hover': {
        background: blue[50]
      }
    },
    currencyTable: {
      '& .homeCurrency': {
        backgroundColor: '#ffe0b2 !important',
        '&:hover': {
          backgroundColor: `${darken('#ffe0b2', 0.2)} !important`
        }
      }
    },
    link: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      // maxWidth: (props: any) => parseInt(props.width) - 16,
      fontSize: theme.typography.body2.fontSize,
      border: '1px solid #dadde9',
      maxWidth: 500
    }
  }
})

export default useStyles
