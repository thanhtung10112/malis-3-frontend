import { useState, useMemo, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Paper, TextField, Grid } from '@material-ui/core'
import { DataTable } from '@/components'

import _ from 'lodash'
import * as columnProperties from '@/utils/columnProperties'
import HttpService from '@/helper/HttpService'
import { commonStore } from '@/store/reducers'

import type { TabHistoryProps } from './type'
import type { GridColumns, GridRowParams } from '@material-ui/data-grid'
import type { HistoryLog } from '@/types/Common'

const AppTabHistoryLog: React.FC<TabHistoryProps> = (props) => {
  const { entityId, tableHeight, mode, descriptionRows, extraColumns, entity, onChange, data, isOpenDialog } = props

  const httpService = new HttpService('')

  const [operationDetail, setOperationDetail] = useState('')
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const defaultColumns = useMemo<GridColumns>(
    () => [
      {
        ...columnProperties.defaultProperties,
        field: 'operation_code',
        headerName: 'Tr.',
        width: 80
      },
      {
        ...columnProperties.defaultProperties,
        field: 'created_at',
        headerName: 'Date Time',
        flex: 0.6
      },
      {
        ...columnProperties.defaultProperties,
        field: 'created_by',
        headerName: 'User',
        width: 80
      },
      {
        ...columnProperties.defaultProperties,
        field: 'operation_description',
        headerName: 'Description',
        flex: 0.6
      }
    ],
    []
  )

  const columns = [...defaultColumns, ...extraColumns]

  useEffect(() => {
    if (data.length === 0 && (_.isNil(isOpenDialog) || isOpenDialog)) {
      getHistoryData()
    }
  }, [entityId, entity, data, isOpenDialog])

  // reset history log if close the dialog
  useEffect(() => {
    if (_.isNil(isOpenDialog)) {
      return
    }
    if (!isOpenDialog && data.length > 0) {
      onChange([])
    }
  }, [data, isOpenDialog, onChange])

  const getHistoryData = async () => {
    setLoading(true)
    try {
      const { history_logs }: any = await httpService.get('history', { entity, pk: entityId })
      onChange(history_logs as HistoryLog[])
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    setLoading(false)
  }

  const handleSelectOperation = (params: GridRowParams) => {
    const id = params.id as number
    const operation = _.find(data, { id })
    setOperationDetail(operation?.changelogs || '')
  }

  return (
    <div className="history">
      <Grid container spacing={2}>
        <Grid item xs={mode === 'vertical' ? 12 : 7}>
          <Paper>
            <DataTable
              rows={data}
              columns={columns}
              tableHeight={tableHeight}
              loading={loading}
              onRowClick={handleSelectOperation}
              hideFooter
            />
          </Paper>
        </Grid>
        <Grid item xs={mode === 'vertical' ? 12 : 5}>
          <TextField multiline rows={descriptionRows} value={operationDetail} />
        </Grid>
      </Grid>
    </div>
  )
}

AppTabHistoryLog.defaultProps = {
  tableHeight: 350,
  mode: 'vertical',
  descriptionRows: 7,
  extraColumns: []
}

export default AppTabHistoryLog
