import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { DialogMain, FormControllerTabs, BtnHelp, AppTabHistoryLog } from '@/components'
import TabGeneral from './TabGeneral'
import Context from './Context'

import _ from 'lodash'
import { commonStore } from '@/store/reducers'
import { yupResolver } from '@hookform/resolvers/yup'
import getValidationSchema from './validationSchema'
import { defaultTagDetail } from '@/utils/defaultValues'
import tagApi from '@/apis/tag.api'

import type { TagDetail } from '@/types/Tag'
import type { DataForDropdown, HistoryLog } from '@/types/Common'
import type { DialogTagProps } from './type'

const DialogTag: React.FC<DialogTagProps> = (props) => {
  const { open, onClose, detail, initData } = props

  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([])

  const { t } = useTranslation('element')

  const dispatch = useDispatch()

  const { wiki_page, permissions } = initData
  const userDrawing = useSelector(commonStore.selectUserValueDrawing)

  const isCreating = _.isNil(detail?.id)

  const vaidationSchema = useMemo(() => getValidationSchema(t), [])
  const tagForm = useForm<TagDetail>({
    shouldUnregister: false,
    resolver: yupResolver(vaidationSchema),
    defaultValues: defaultTagDetail
  })

  useEffect(() => {
    if (_.isPlainObject(detail)) {
      _.forIn(detail, (value, key) => {
        tagForm.setValue(key, value)
      })
    }
  }, [detail])

  const onChangeLoading = (newLoading: boolean) => {
    setLoading(newLoading)
  }

  const handleCreateTag = async (formData: TagDetail) => {
    setLoading(true)
    try {
      const { message } = await tagApi.create(formData)
      if (userDrawing.value > 0) {
        const { generated_code } = await tagApi.getGenerateCode(userDrawing.value)
        tagForm.reset({ ...detail, element_id: generated_code })
      } else {
        tagForm.reset({ ...detail })
      }
      dispatch(commonStore.actions.setSuccessMessage(message))
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    setLoading(false)
  }

  const handleUpdateTag = async (id: number, formData: TagDetail) => {
    setLoading(true)
    try {
      const { message } = await tagApi.update(id, formData)
      dispatch(commonStore.actions.setSuccessMessage(message))
      handleClose()
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    setLoading(false)
  }

  const handleSubmitForm = tagForm.handleSubmit((formData) => {
    formData.schematic_id = (formData.schematic_id as DataForDropdown).value
    formData.part_id = (formData.part_id as DataForDropdown)?.value || null
    const data = _.pick(formData, [
      'job_id',
      'schematic_id',
      'element_id',
      'part_id',
      'tag',
      'fluid',
      'tech_data',
      'descriptions',
      'functions',
      'additional_attributes'
    ])
    if (isCreating) {
      handleCreateTag(data)
    } else {
      const tagEdit = _(formData)
        .assign({ element_id_pk: formData.id })
        .pick([
          'fluid',
          'tech_data',
          'descriptions',
          'functions',
          'tag',
          'element_id',
          'part_id',
          'additional_attributes'
        ])
        .value()
      handleUpdateTag(formData.id, tagEdit as TagDetail)
    }
  })

  const handleClose = () => {
    handleChangeHistoryLogs([])
    tagForm.reset()
    onClose()
    setTab(0)
  }

  const handleChangeTab = (event, nextTab: number) => {
    setTab(nextTab)
  }

  const handleChangeHistoryLogs = (data: HistoryLog[]) => {
    setHistoryLogs(data)
  }

  const generalTab = {
    label: t('common:tab.general'),
    panel: <TabGeneral />,
    errorKey: ['schematic_id', 'element_id ', 'job_id', 'part_id', 'tag', 'fluid', 'tech_data', 'functions']
  }

  const historyTab = {
    label: t('common:tab.history'),
    panel: (
      <AppTabHistoryLog
        data={historyLogs}
        onChange={handleChangeHistoryLogs}
        entityId={detail?.id}
        mode="horizonatal"
        tableHeight={430}
        descriptionRows={26}
        entity="element"
      />
    ),
    disabled: isCreating
  }

  const tabs = [generalTab, historyTab]

  return (
    <DialogMain
      fullWidth
      maxWidth="md"
      open={open}
      loading={loading}
      title={<BtnHelp title={isCreating ? t('form.title.create_tag') : t('form.title.update_tag')} href={wiki_page} />}
      onOk={handleSubmitForm}
      onClose={handleClose}
      okText={isCreating ? t('common:button.create') : t('common:button.update')}
      okButtonProps={{
        disabled: loading || (!permissions.element?.edit && !isCreating)
      }}
    >
      <Context.Provider value={{ ...props, onChangeLoading }}>
        <FormControllerTabs form={tagForm} value={tab} onChange={handleChangeTab} tabs={tabs} />
      </Context.Provider>
    </DialogMain>
  )
}

export default DialogTag
