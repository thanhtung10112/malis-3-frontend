import { createStyles, makeStyles } from '@material-ui/core/styles'
import { green, purple, red } from '@material-ui/core/colors'

const borderSection = {
  border: '1px solid #e5e5e5',
  borderRadius: '5px'
}

const backgroundButton = (bgColor, color) => ({
  backgroundColor: bgColor,
  color
})

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      textAlign: 'center',
      padding: theme.spacing(0, 1)
    },
    heading: {
      textAlign: 'center'
    },
    button: {
      marginTop: theme.spacing(1.5),
      '& button': {
        marginTop: theme.spacing(0.5),
        width: '100%'
      }
    },
    wrapButtonGroup: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing(1.5)
    },
    sectionCriteria: {
      ...borderSection
    } as any,
    sectionGeneralInfor: {
      ...borderSection,
      padding: theme.spacing(2),
      marginTop: theme.spacing(2.5),
      minHeight: 200,
      maxHeight: 200,
      overflow: 'hidden'
    } as any,
    setAsDefault: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    tabPanel: {
      paddingLeft: theme.spacing(2),
      maxHeight: 318,
      minHeight: 318,
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    dialogContent: {
      padding: theme.spacing(0, 1),
      overflow: 'hidden'
    },
    buttonAction: {
      padding: theme.spacing(0.5, 1),
      '&.disabled': {
        opacity: 0.4
      },
      '&:not(:first-child)': {
        marginLeft: theme.spacing(1)
      },
      '&.pdf': {
        ...backgroundButton(purple[500] as any, 'white')
      },
      '&.excel': {
        ...backgroundButton(green[500] as any, 'white')
      },
      '&.screen': {
        ...backgroundButton(red[500] as any, 'white')
      },
      [theme.breakpoints.down('md')]: {
        fontSize: '12px !important'
      }
    },
    generalInfo: {
      margin: '10px 0',
      padding: 20
    },
    nameColumn: {
      width: 200
    },
    hidden: {
      visibility: 'hidden'
    },
    wrapLeftTable: {
      marginTop: 6
    },
    defaultPreset: {
      fontSize: 14,
      '& span': {
        textDecoration: 'underline',
        cursor: 'pointer'
      }
    }
    // wrapPresetDetail: {
    //   marginTop: theme.spacing(2)
    // }
  })
)
export default useStyles
