import { useState } from 'react'
import useStyles from './styles'
import { useDispatch } from 'react-redux'
import { useFormContext } from 'react-hook-form'

import { Paper, Link } from '@material-ui/core'
import { DataTable, CreateIcon, DeleteIcon, useConfirm, AppButton, DialogPart } from '@/components'

import _ from 'lodash'
import drawingApi from '@/apis/drawing.api'
import partApi from '@/apis/part.api'
import { defaultProperties, rightColumn } from '@/utils/columnProperties'
import { drawingStore, partStore, commonStore, summaryReportActions } from '@/store/reducers'
import { isAssemblyByDpn } from '@/utils/isAssembly'

import type { PartEntity } from '@/types/Part'
import { PayloadOperation } from '@/types/Common'

const TabComponent: React.FC = () => {
  const classes = useStyles()
  const { confirm } = useConfirm()

  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const drawingForm = useFormContext()
  const watchItemList = drawingForm.watch('item_list', [])
  const watchId = drawingForm.watch('id', null)

  const dispatch = useDispatch()

  const handleOpenComponentDialog = (partEntity: PartEntity) => () => {
    dispatch(drawingStore.sagaOpenCreatePartDialog(partEntity))
  }

  const handleSelectRows = ({ selectionModel }) => {
    setSelectedRows(selectionModel)
  }

  const buildDescription = () => {
    if (selectedRows.length > 1) {
      return `Are you sure you want to delete ${selectedRows.length} selected parts?`
    }
    return `Are you sure you want to delete ${selectedRows.length} selected part?`
  }

  const deleteParts = async () => {
    dispatch(drawingStore.actions.setDialogStateLoading(true))
    try {
      const parts: PayloadOperation[] = _.map(selectedRows, (partId) => {
        const { dpn, id } = _.find(watchItemList, { id: partId })
        return { entity_id: dpn, id }
      })
      const data = await partApi.executeOperation('delete', parts)
      if (data.failed_count > 0) {
        dispatch(summaryReportActions.setReportData(data))
        dispatch(summaryReportActions.setOpen(true))
      } else {
        dispatch(commonStore.actions.setSuccessMessage(data.message))
      }
      const { drawing } = await drawingApi.getDetail(watchId)
      drawingForm.setValue('item_list', drawing.item_list)
      setSelectedRows([])
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    dispatch(drawingStore.actions.setDialogStateLoading(false))
  }

  const handleDeleteParts = async () => {
    const description = buildDescription()
    const result = await confirm({
      description
    })
    if (result === 'OK') {
      deleteParts()
    }
  }

  const handleOpenPartDialog = (id: number, dpn: string) => (event) => {
    event.preventDefault()
    const entity = isAssemblyByDpn(dpn) ? 'assembly' : 'item'
    dispatch(partStore.sagaOpenUpdateDialog({ id, entity }))
  }

  const handleClosePartDialog = async () => {
    setSelectedRows([])
    dispatch(drawingStore.actions.setDialogStateLoading(true))
    try {
      const { drawing } = await drawingApi.getDetail(watchId)
      drawingForm.setValue('item_list', drawing.item_list)
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    dispatch(drawingStore.actions.setDialogStateLoading(false))
  }

  const newButtonDropdown = [
    {
      label: 'Item',
      onClick: handleOpenComponentDialog('item')
    },
    {
      label: 'Assembly',
      onClick: handleOpenComponentDialog('assembly')
    }
  ]

  return (
    <>
      <div className={classes.buttonGroupRoot}>
        <AppButton startIcon={<CreateIcon />} item={newButtonDropdown}>
          New
        </AppButton>
        <AppButton startIcon={<DeleteIcon />} onClick={handleDeleteParts} disabled={selectedRows.length === 0}>
          Remove
        </AppButton>
      </div>
      <Paper elevation={1}>
        <DataTable
          rows={watchItemList}
          checkboxSelection
          selectionModel={selectedRows}
          onSelectionModelChange={handleSelectRows}
          onCellClick={(params, event) => {
            if (['dpn', 'reference_to'].includes(params.field)) {
              event.stopPropagation()
            }
          }}
          columns={[
            {
              ...defaultProperties,
              field: 'dpn',
              headerName: 'Item',
              flex: 0.2,
              renderCell(params) {
                const { value, id } = params
                return (
                  <Link href="#" onClick={handleOpenPartDialog(id as number, value as string)}>
                    {value}
                  </Link>
                )
              }
            },
            {
              ...defaultProperties,
              field: 'reference_to',
              headerName: 'Referenced Part Number',
              flex: 0.2,
              renderCell(params) {
                const { value, row } = params
                return (
                  <Link href="#" onClick={handleOpenPartDialog(row.id_ref, value as string)}>
                    {value}
                  </Link>
                )
              }
            },
            {
              ...defaultProperties,
              field: 'description',
              headerName: 'Description',
              flex: 0.2
            },
            {
              ...defaultProperties,
              ...rightColumn,
              field: 'mass',
              headerName: 'Mass (kg)',
              flex: 0.1
            },
            {
              ...defaultProperties,
              field: 'raw_unit',
              headerName: 'Unit',
              flex: 0.1
            },
            {
              ...defaultProperties,
              field: 'material',
              headerName: 'Material',
              flex: 0.1
            }
          ]}
          hideFooter
          tableHeight={385}
        />
      </Paper>
      <DialogPart onClose={handleClosePartDialog} />
    </>
  )
}

export default TabComponent
