import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import useStyles from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'

import { Paper, Link } from '@material-ui/core'
import { DataTable, CreateIcon, DeleteIcon, AppButton, DialogTag, DialogPart, useConfirm } from '@/components'

import immer from 'immer'
import _ from 'lodash'
import drawingApi from '@/apis/drawing.api'
import tagApi from '@/apis/tag.api'
import { commonStore, drawingStore, partStore, summaryReportActions } from '@/store/reducers'
import { defaultTagInitDataForCE, defaultTagDetail } from '@/utils/defaultValues'
import { defaultProperties } from '@/utils/columnProperties'
import { isAssemblyByDpn } from '@/utils/isAssembly'
import getMessageConfirm from '@/utils/getMessageConfirm'

import type { DrawingDetail } from '@/types/Drawing'
import type { DataForDropdown, PayloadOperation } from '@/types/Common'

const TabTags: React.FC = () => {
  const classes = useStyles()
  const { confirm } = useConfirm()
  const { t } = useTranslation('element')

  const [openDialog, setOpenDialog] = useState(false)
  const [initDataForCE, setInitDataForCE] = useState(defaultTagInitDataForCE)
  const [tagDetail, setTagDetail] = useState(defaultTagDetail)
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const drawingForm = useFormContext<DrawingDetail>()
  const watchTagsList = drawingForm.watch('tag_list', []) || []
  const watchId = drawingForm.watch('id', null)
  const watchDrawing_id = drawingForm.watch('drawing_id', '')

  const dispatch = useDispatch()
  const userJob = useSelector(commonStore.selectUserValueJob)
  const userDrawing = useSelector(commonStore.selectUserValueDrawing)

  useEffect(() => {
    const schematicValue = userDrawing.value > 0 ? userDrawing : null
    setTagDetail((currentState) =>
      immer(currentState, (draft) => {
        draft.schematic_id = schematicValue
      })
    )
  }, [userDrawing])

  useEffect(() => {
    setTagDetail((currentState) =>
      immer(currentState, (draft) => {
        draft.job_id = userJob.value
      })
    )
  }, [userJob])

  const handleSelectRows = ({ selectionModel }) => {
    setSelectedRows(selectionModel)
  }

  const resetDetail = () => {
    setTagDetail(() =>
      immer(defaultTagDetail, (draft) => {
        draft.schematic_id = userDrawing.value > 0 ? userDrawing : null
        draft.job_id = userJob.value
      })
    )
  }

  const handleClosePartDialog = async () => {
    dispatch(drawingStore.actions.setDialogStateLoading(true))
    try {
      const { drawing } = await drawingApi.getDetail(watchId)
      drawingForm.setValue('tag_list', drawing.tag_list)
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    dispatch(drawingStore.actions.setDialogStateLoading(false))
  }

  const handleCloseElementDialog = async () => {
    setOpenDialog(false)
    dispatch(drawingStore.actions.setDialogStateLoading(true))
    try {
      const { drawing } = await drawingApi.getDetail(watchId)
      drawingForm.setValue('tag_list', drawing.tag_list)
      resetDetail()
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    dispatch(drawingStore.actions.setDialogStateLoading(false))
  }

  const updateUserDrawing = () => {
    dispatch(
      commonStore.actions.setUserValueDrawing({
        entity_id: watchDrawing_id,
        description: '',
        value: watchId
      })
    )
  }

  const handleOpenTagCreateDialog = async () => {
    updateUserDrawing()
    dispatch(commonStore.actions.setLoadingPage(true))
    try {
      const resInitDataForCE = await tagApi.getInitDataForCE({ job_id_pk: userJob.value })
      const { generated_code } = await tagApi.getGenerateCode(watchId)
      setInitDataForCE(resInitDataForCE)
      setTagDetail((currentState) =>
        immer(currentState, (draft) => {
          draft.element_id = generated_code
        })
      )
      setOpenDialog(true)
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    dispatch(commonStore.actions.setLoadingPage(false))
  }

  const handleOpenTagUpdateDialog = (id: number) => async (event) => {
    event.preventDefault()
    updateUserDrawing()
    dispatch(commonStore.actions.setLoadingPage(true))
    try {
      const resInitDataForCE = await tagApi.getInitDataForCE({ job_id_pk: userJob.value })
      const { element } = await tagApi.getDetail(id)
      setInitDataForCE(resInitDataForCE)
      setTagDetail(
        immer(element, (draft) => {
          draft.schematic_id = element.related_schematic
          draft.part_id = element.related_part
        }) as any
      )
      setOpenDialog(true)
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    dispatch(commonStore.actions.setLoadingPage(false))
  }

  const handleOpenPartUpdateDialog = (id: number, dpn: string) => (event) => {
    event.preventDefault()
    const entity = isAssemblyByDpn(dpn) ? 'assembly' : 'item'
    dispatch(partStore.sagaOpenUpdateDialog({ id, entity }))
  }

  const deleteTags = async () => {
    dispatch(drawingStore.actions.setDialogStateLoading(true))
    try {
      const tags: PayloadOperation[] = _.map(selectedRows, (partId) => {
        const { rp_element_id, id } = _.find(watchTagsList, { id: partId })
        return { entity_id: rp_element_id, id }
      })
      const data = await tagApi.executeOperation('delete', tags)
      if (data.failed_count > 0) {
        dispatch(summaryReportActions.setReportData(data))
        dispatch(summaryReportActions.setOpen(true))
      } else {
        dispatch(commonStore.actions.setSuccessMessage(data.message))
      }
      const { drawing } = await drawingApi.getDetail(watchId)
      drawingForm.setValue('tag_list', drawing.tag_list)
      setSelectedRows([])
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    dispatch(drawingStore.actions.setDialogStateLoading(false))
  }

  const handleRemoveTags = async () => {
    const description = getMessageConfirm(t, 'element', selectedRows, 'delete')
    const result = await confirm({ description })
    if (result === 'OK') {
      deleteTags()
    }
  }

  return (
    <>
      <div className={classes.buttonGroupRoot}>
        <AppButton startIcon={<CreateIcon />} onClick={handleOpenTagCreateDialog}>
          New
        </AppButton>
        <AppButton startIcon={<DeleteIcon />} disabled={selectedRows.length === 0} onClick={handleRemoveTags}>
          Remove
        </AppButton>
      </div>
      <Paper elevation={1}>
        <DataTable
          rows={watchTagsList}
          checkboxSelection
          selectionModel={selectedRows}
          onSelectionModelChange={handleSelectRows}
          onCellClick={(params, event) => {
            if (['element_id'].includes(params.field)) {
              event.stopPropagation()
            }
          }}
          columns={[
            {
              ...defaultProperties,
              field: 'element_id',
              headerName: 'Element #',
              flex: 0.15,
              renderCell(params) {
                const { value, id } = params
                return (
                  <Link href="#" onClick={handleOpenTagUpdateDialog(id as number)}>
                    {value}
                  </Link>
                )
              }
            },
            {
              ...defaultProperties,
              field: 'tag',
              headerName: 'Tag #',
              flex: 0.15
            },
            {
              ...defaultProperties,
              field: 'related_part',
              headerName: 'Part',
              valueGetter: (params) => (params.value as DataForDropdown).entity_id,
              renderCell(params) {
                const { row } = params
                const { value, entity_id } = row.related_part
                return (
                  <Link href="#" onClick={handleOpenPartUpdateDialog(value, entity_id)}>
                    {params.value}
                  </Link>
                )
              },
              flex: 0.15
            },
            {
              ...defaultProperties,
              field: 'description',
              headerName: 'Description',
              flex: 0.6
            }
          ]}
          hideFooter
          tableHeight={385}
        />
      </Paper>
      <DialogTag open={openDialog} initData={initDataForCE} detail={tagDetail} onClose={handleCloseElementDialog} />
      <DialogPart onClose={handleClosePartDialog} />
    </>
  )
}

export default TabTags
