import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { DialogMain, FormControllerTabs, AppTabHistoryLog, TableExtendedProperties, BtnHelp } from '@/components'
import TabGeneral from './TabGeneral'

import { commonStore, specificationStore } from '@/store/reducers'
import { yupResolver } from '@hookform/resolvers/yup'
import _ from 'lodash'
import getValidationSchema from './validationSchema'

import type { SpecificationDetail } from '@/types/Specification'
import type { DataForDropdown, HistoryLog } from '@/types/Common'

const DialogSpecificationCE = () => {
  const { t } = useTranslation('specification')

  const dispatch = useDispatch()

  const dialogState = useSelector(specificationStore.selectDialogState)
  const specificationDetail = useSelector(specificationStore.selectDetail)
  const userDrawing = useSelector(commonStore.selectUserValueDrawing)
  const { parameters, wiki_page } = useSelector(specificationStore.selectInitDataForCE)
  const permissions = useSelector(specificationStore.selectPermissions)

  const isCreating = _.isNil(specificationDetail.id)

  const vaidationSchema = useMemo(() => getValidationSchema(t), [])
  const specificationForm = useForm<SpecificationDetail>({
    shouldUnregister: false,
    resolver: yupResolver(vaidationSchema)
  })

  useEffect(() => {
    specificationForm.reset(specificationDetail)
  }, [specificationDetail])

  useEffect(() => {
    if (userDrawing.value === -1) {
      dispatch(specificationStore.actions.setDetail({ drawing_id: null }))
    } else {
      dispatch(specificationStore.actions.setDetail({ drawing_id: userDrawing }))
    }
  }, [userDrawing])

  const handleSubmitForm = specificationForm.handleSubmit((formData) => {
    formData.drawing_id = (formData.drawing_id as DataForDropdown).value
    const data = _.pick(formData, ['job_id', 'drawing_id', 'spec_id', 'descriptions'])
    if (isCreating) {
      dispatch(specificationStore.sagaCreate(data))
    } else {
      const specEdit = _.pick(formData, 'descriptions')
      dispatch(
        specificationStore.sagaUpdate({
          id: formData.id,
          formData: specEdit as SpecificationDetail
        })
      )
    }
  })

  const handleClose = () => {
    dispatch(specificationStore.sagaCloseDialog())
  }

  const handleChangeTab = (event, nextTab: number) => {
    dispatch(specificationStore.actions.setDialogStateTab(nextTab))
  }

  const handleChangeHistoryLogs = (data: HistoryLog[]) => {
    dispatch(specificationStore.actions.setHistoryLogs(data))
  }

  const generalTab = {
    label: t('common:tab.general'),
    panel: <TabGeneral />,
    errorKey: ['drawing_id', 'spec_id', 'job_id']
  }

  const historyTab = {
    label: t('common:tab.history'),
    panel: (
      <AppTabHistoryLog
        isOpenDialog={dialogState.open}
        data={dialogState.historyLogs}
        onChange={handleChangeHistoryLogs}
        entityId={specificationDetail.id}
        mode="horizonatal"
        tableHeight={315}
        descriptionRows={20}
        entity="specification"
      />
    ),
    disabled: isCreating
  }

  const extendedPropertyTab = {
    label: t('common:tab.extended_properties'),
    panel: (
      <TableExtendedProperties
        control={specificationForm.control}
        name="additional_attributes"
        editMode={!isCreating}
        propertiesList={parameters.SSAT}
        tableHeight={335}
        parameterName="SSAT"
      />
    )
  }

  const tabs = [generalTab, extendedPropertyTab, historyTab]

  return (
    <DialogMain
      fullWidth
      maxWidth="md"
      open={dialogState.open}
      loading={dialogState.loading}
      title={
        <BtnHelp
          title={isCreating ? t('form.title.create_specification') : t('form.title.update_specification')}
          href={wiki_page}
        />
      }
      onOk={handleSubmitForm}
      onClose={handleClose}
      okText={isCreating ? t('common:button.create') : t('common:button.update')}
      okButtonProps={{
        disabled: dialogState.loading || (!permissions?.edit && !isCreating)
      }}
    >
      <FormControllerTabs form={specificationForm} value={dialogState.tab} onChange={handleChangeTab} tabs={tabs} />
    </DialogMain>
  )
}

export default DialogSpecificationCE
