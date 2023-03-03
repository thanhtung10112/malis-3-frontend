import React from 'react'

import { Paper, Button } from '@material-ui/core'
import SyncIcon from '@material-ui/icons/Sync'
import { DataTable } from '@/components'

import useStyles from './styles'

import { defaultProperties } from '@/utils/columnProperties'

const TabSynchronization: React.FC = () => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.buttonGroupRoot}>
        <Button startIcon={<SyncIcon />}>Synchronize</Button>
      </div>
      <Paper elevation={1}>
        <DataTable
          rows={[]}
          columns={[
            {
              ...defaultProperties,
              field: 'job_id',
              headerName: 'Job',
              flex: 0.2
            },
            {
              ...defaultProperties,
              field: 'revision',
              headerName: 'Rev',
              flex: 0.2
            },
            {
              ...defaultProperties,
              field: 'description',
              headerName: 'Description',
              flex: 0.5
            }
          ]}
          tableHeight={355}
          hideFooter
          checkboxSelection
        />
      </Paper>
    </>
  )
}

export default TabSynchronization
