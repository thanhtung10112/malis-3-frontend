import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Paper } from '@material-ui/core'

import { GridColumns } from '@material-ui/data-grid'

import { DialogMain, DataTable } from '@/components/index'

import { summaryReportActions } from '@/store/reducers'

import * as columnProperties from '@/utils/columnProperties'

function MalisBulkOperationReportDialog() {
  const dispatch = useDispatch()

  const dialogState = useSelector(summaryReportActions.selectState)

  const handleClose = () => {
    dispatch(summaryReportActions.setOpen(false))
  }

  const columns: GridColumns = [
    {
      ...columnProperties.defaultProperties,
      field: 'id',
      headerName: 'ID',
      flex: 0.2
    },
    {
      ...columnProperties.defaultProperties,
      field: 'reason',
      headerName: 'Failed reason',
      flex: 0.8
    }
  ]

  const rows = dialogState.failedReasons

  return (
    <DialogMain open={dialogState.open} maxWidth="sm" fullWidth title={dialogState.title} onClose={handleClose}>
      <b>Success:</b> {dialogState.numberOfSuccess} <br />
      <b>Failed:</b> {dialogState.numberOfFailed} <p></p>
      <Paper elevation={1}>
        <DataTable tableHeight="20rem" rows={rows} columns={columns} rowHeight={30} hideFooter />
      </Paper>
    </DialogMain>
  )
}

export default MalisBulkOperationReportDialog
