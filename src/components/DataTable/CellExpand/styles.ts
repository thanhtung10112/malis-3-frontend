import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  cellValue: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    // maxWidth: (props: any) => parseInt(props.width) - 16,
    fontSize: theme.typography.body2.fontSize,
    border: '1px solid #dadde9',
    maxWidth: 500
  }
}))

export default useStyles
