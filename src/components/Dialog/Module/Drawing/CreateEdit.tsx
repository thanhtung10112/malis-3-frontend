import { useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'

import { DialogMain, TableExtendedProperties, AppTabHistoryLog, FormControllerTabs, BtnHelp } from '@/components'

import TabGeneral from './TabGeneral'
import TabDetail from './TabDetail'
import TabParts from './TabParts'
import TabTags from './TabTags'
import TabSynchronization from './TabSynchronization'
import TabJobNotice from './TabJobNotice'
import TabParent from './TabParent'
import DialogRevision from './DialogRevision'

import _ from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup'
import { drawingStore, commonStore } from '@/store/reducers'
import getValidationSchema from './validationSchema'
import { defaultProperties } from '@/utils/columnProperties'

import type { DrawingDetail } from '@/types/Drawing'
import type { ExtraButton } from '@/components/Dialog/Main/type'
import type { HistoryLog } from '@/types/Common'

function DialogDrawingCreateEdit() {
  const { t } = useTranslation('drawing')
  const validationSchema = useMemo(() => getValidationSchema(t), [])

  const dispatch = useDispatch()
  const dialogState = useSelector(drawingStore.selectDialogState)
  const drawingDetail = useSelector(drawingStore.selectDetail)
  const userJob = useSelector(commonStore.selectUserValueJob)
  const { parameters, wiki_page } = useSelector(drawingStore.selectInitDataForCE)
  const permissions = useSelector(drawingStore.selectPermissions)

  const isCreating = _.isNil(drawingDetail.id)

  const drawingForm = useForm<DrawingDetail>({
    shouldUnregister: false,
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    drawingForm.reset(drawingDetail)
  }, [drawingDetail])

  const onChangeTab = (event, nextTab: number) => {
    dispatch(drawingStore.actions.setDialogStateTab(nextTab))
  }

  const onSubmitData = drawingForm.handleSubmit((data) => {
    data.job_id = userJob.value
    data.associated_documents = data.associated_documents.map(({ value }) => parseInt(value))
    const drawing = _.pick(data, [
      'additional_attributes',
      'associated_documents',
      'customer_id',
      'descriptions',
      'drawing_format',
      'drawing_purpose',
      'exclude_from_customer',
      'exclude_from_other',
      'exclude_from_supplier',
      'file_prefix',
      'file_type',
      'job_id',
      'revision',
      'drawing_id',
      'is_detail_drawing',
      'is_drawing',
      'is_other_document',
      'is_schematic',
      'is_specification'
    ])
    if (isCreating) {
      dispatch(drawingStore.sagaCreate(drawing))
    } else {
      const payloadUpdate = _.omit(drawing, ['drawing_id', 'revison']) as DrawingDetail
      dispatch(
        drawingStore.sagaUpdate({
          id: data.id,
          drawing: payloadUpdate
        })
      )
    }
  })

  const handleClose = () => {
    dispatch(drawingStore.sagaCloseDialog())
  }

  const handleOpenRevisionDialog = () => {
    dispatch(drawingStore.sagaOpenRevDialog(drawingDetail.revision))
  }

  const handleChangeHistoryLogs = (data: HistoryLog[]) => {
    dispatch(drawingStore.actions.setHistoryLogs(data))
  }

  const extraButtons: ExtraButton[] = [
    {
      label: t('button.save_as_revision'),
      hide: isCreating,

      disabled: dialogState.loading || (!permissions?.edit && !isCreating),
      onClick: handleOpenRevisionDialog
    },
    {
      label: isCreating ? t('common:button.create') : t('common:button.update'),
      disabled: dialogState.loading || (!permissions?.edit && !isCreating),
      onClick: onSubmitData
    },
    {
      label: t('common:button.close'),
      onClick: handleClose
    }
  ]

  const generalTab = {
    label: t('common:tab.general'),
    panel: <TabGeneral />,
    errorKey: ['drawing_id', 'customer_id', 'revision', 'drawing_format', 'drawing_purpose']
  }

  const detailTab = {
    label: t('form.tab.detail'),
    panel: <TabDetail />
  }

  const partsTab = {
    label: t('form.tab.parts'),
    panel: <TabParts />,
    hide: isCreating
  }

  const tagsTab = {
    label: t('form.tab.tags'),
    panel: <TabTags />,
    hide: isCreating
  }

  const syncTab = {
    label: t('form.tab.synchronization'),
    panel: <TabSynchronization />,
    hide: isCreating,
    disabled: true
  }

  const jobNoticeTab = {
    label: t('form.tab.job_notices'),
    panel: <TabJobNotice />,
    hide: isCreating,
    disabled: true
  }

  const parentTab = {
    label: t('form.tab.parents'),
    panel: <TabParent />,
    hide: isCreating,
    disabled: true
  }

  const historyTab = {
    label: t('common:tab.history'),
    panel: (
      <AppTabHistoryLog
        isOpenDialog={dialogState.open}
        data={dialogState.historyLogs}
        onChange={handleChangeHistoryLogs}
        entityId={drawingDetail.id}
        mode="horizonatal"
        tableHeight={430}
        descriptionRows={26}
        entity="drawing"
        extraColumns={[
          {
            ...defaultProperties,
            field: 'revision',
            headerName: 'Revision',
            width: 100
          }
        ]}
      />
    ),
    hide: isCreating
  }

  const extendedPropertyTab = {
    label: t('common:tab.extended_properties'),
    panel: (
      <TableExtendedProperties
        control={drawingForm.control}
        name="additional_attributes"
        editMode={!isCreating}
        propertiesList={parameters.PLAT}
        tableHeight={435}
        parameterName="PLAT"
      />
    )
  }

  const tabs = [
    generalTab,
    detailTab,
    partsTab,
    tagsTab,
    syncTab,
    jobNoticeTab,
    parentTab,
    historyTab,
    extendedPropertyTab
  ]

  return (
    <>
      <DialogMain
        open={dialogState.open}
        loading={dialogState.loading}
        title={
          <BtnHelp
            title={isCreating ? t('form.title.create_drawing') : t('form.title.update_drawing')}
            href={wiki_page}
          />
        }
        fullWidth
        maxWidth="lg"
        extraButtons={extraButtons}
        height={510}
        onClose={handleClose}
      >
        <FormControllerTabs value={dialogState.tab} onChange={onChangeTab} form={drawingForm} tabs={tabs} />
      </DialogMain>
      <DialogRevision />
    </>
  )
}

export default DialogDrawingCreateEdit
