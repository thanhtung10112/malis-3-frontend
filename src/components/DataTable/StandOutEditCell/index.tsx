import { Tooltip, makeStyles } from '@material-ui/core'
import { EditIcon } from '@/components'
import { If, Else, Then, When } from 'react-if'

const useStyles = makeStyles(() => ({
  headerIcon: {
    height: '100%',
    fontSize: 14,
    margin: '1px 8px 0px 8px'
  }
}))

function DataTableStandOutEditCell({ headerName, editable, desc }) {
  const classes = useStyles()
  return (
    <If condition={desc}>
      <Then>
        <Tooltip title={desc}>
          <span>{headerName}</span>
        </Tooltip>
        <When condition={editable}>
          <Tooltip title="This column is editable, double click on each cell to edit.">
            <EditIcon className={classes.headerIcon} />
          </Tooltip>
        </When>
      </Then>
      <Else>
        <span>{headerName}</span>
        <When condition={editable}>
          <Tooltip title="This column is editable, double click on each cell to edit.">
            <EditIcon className={classes.headerIcon} />
          </Tooltip>
        </When>
      </Else>
    </If>
  )
}

export default DataTableStandOutEditCell
