import React from 'react'

import { Typography, Button, Paper } from '@material-ui/core'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import { EnableIcon, DisableIcon, DataTable } from '@/components'

import { defaultProperties } from '@/utils/columnProperties'

import useStyles from './styles'

const TabJobNotice: React.FC = () => {
  const classes = useStyles()

  return (
    <>
      <Typography variant="body1" style={{ fontWeight: 500 }}>
        Select the notices then click on the &quot;Acknowledge&quot; button to confirm
      </Typography>

      <div className={classes.buttonGroupRoot}>
        <Button startIcon={<EnableIcon />}>Acknowledge</Button>
        <Button startIcon={<DisableIcon />}>UnAcknowledge</Button>
        <Button startIcon={<RemoveCircleIcon />}>N.A</Button>
      </div>
      <Paper elevation={1}>
        <DataTable
          hideFooter
          checkboxSelection
          tableHeight={330}
          rows={[]}
          columns={[
            {
              ...defaultProperties,
              headerName: 'Type',
              field: 'type',
              flex: 0.2
            },
            {
              ...defaultProperties,
              headerName: 'Notice #',
              field: 'notice',
              flex: 0.2
            },
            {
              ...defaultProperties,
              headerName: 'Job',
              field: 'job',
              flex: 0.2
            },
            {
              ...defaultProperties,
              headerName: 'Designation',
              field: 'designation',
              flex: 0.2
            },
            {
              ...defaultProperties,
              headerName: 'Ack',
              field: 'ack',
              flex: 0.2
            }
          ]}
        />
      </Paper>
    </>
  )
}

export default TabJobNotice
