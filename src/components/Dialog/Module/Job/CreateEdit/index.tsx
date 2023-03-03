import { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'next-i18next'

import { DialogMain, AppTabHistoryLog, FormControllerTabs, BtnHelp } from '@/components'

import TabGeneral from '../TabGeneral'
import TabAdditionalInfo from '../TabAdditionalInfo'
import TabOthers from '../TabOthers'
import Context from '../Context'

import _ from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup'

import { jobStore } from '@/store/reducers'
import * as constant from '@/utils/constant'
import getValidationSchema from '../validationSchema'

import type { JobDetail } from '@/types/Job'
import type { HistoryLog } from '@/types/Common'

function DialogJobCreateEdit() {
  const { t } = useTranslation('job')
  const validationSchema = useMemo(() => getValidationSchema(t), [])

  const [tab, setTab] = useState(0)

  const jobForm = useForm<JobDetail>({
    shouldUnregister: false,
    resolver: yupResolver(validationSchema)
  })

  const dispatch = useDispatch()
  const dialogState = useSelector(jobStore.selectDialogState)
  const jobDetail = useSelector(jobStore.selectDetail)
  const permissions = useSelector(jobStore.selectPermissions)
  const { wiki_page } = useSelector(jobStore.selectInitDataForCE)

  const isCreating = _.isNil(jobDetail.id)

  useEffect(() => {
    jobForm.reset({
      ...jobDetail
    })
    setTab(0)
    dispatch(jobStore.actions.setTransferListUserGroup([]))
  }, [jobDetail])

  const onCloseCreateEditDialog = () => {
    jobForm.clearErrors()
    dispatch(jobStore.sagaCloseDialog())
  }

  const onSubmitJobData = jobForm.handleSubmit((data) => {
    const payload = _.omit(data, [...constant.removalProperties, 'category', 'malis_version'])

    payload.job_expediting_dates = payload.job_expediting_dates.map((exDate) => {
      if (_.isString(exDate.id)) {
        return _.omit(exDate, 'id')
      }
      return exDate
    })

    payload.job_currencies = payload.job_currencies.map((currency) => ({
      currency_id: currency.id,
      rate: Number(currency.rate)
    })) as any

    payload.job_standard = payload.job_standard.map((job) => _.omit(job, 'status'))

    const formData = new FormData()
    formData.append('job_info', JSON.stringify(_.omit(payload, 'logo')))
    if (payload.logo) {
      formData.append('logo', payload.logo)
    }

    if (isCreating) {
      dispatch(jobStore.sagaCreate(formData))
    } else {
      dispatch(jobStore.sagaUpdate({ id: data.id, formData }))
    }
  })

  const onChangeTab = (_, nextTab: number) => {
    setTab(nextTab)
  }

  const handleChangeHistoryLogs = (data: HistoryLog[]) => {
    dispatch(jobStore.actions.setHistoryLogs(data))
  }

  const generalTab = {
    label: t('common:tab.general'),
    panel: <TabGeneral />,
    errorKey: [
      'job_id',
      'language',
      'equipment_type',
      'erection_site',
      'people_responsible',
      'squad_leader',
      'job_users'
    ]
  }

  const additionalInfoTab = {
    label: t('form.tab.additional_info'),
    panel: <TabAdditionalInfo />
  }

  const otherTab = {
    label: t('common:tab.others'),
    panel: <TabOthers />,
    errorKey: ['contract_no', 'contract_desc', 'credit_letter', 'logo']
  }

  const historyTab = {
    label: t('common:tab.history'),
    disabled: isCreating,
    panel: (
      <AppTabHistoryLog
        isOpenDialog={dialogState.open}
        data={dialogState.historyLogs}
        onChange={handleChangeHistoryLogs}
        entityId={jobDetail.id}
        mode="horizonatal"
        tableHeight={390}
        descriptionRows={25}
        entity="job"
      />
    )
  }

  const tabs = [generalTab, additionalInfoTab, otherTab, historyTab]

  return (
    <DialogMain
      open={dialogState.open}
      loading={dialogState.loading}
      fullWidth
      maxWidth="md"
      title={<BtnHelp title={isCreating ? t('form.title.create_job') : t('form.title.update_job')} href={wiki_page} />}
      onOk={onSubmitJobData}
      onClose={onCloseCreateEditDialog}
      height={470}
      okButtonProps={{
        disabled: dialogState.loading || (!permissions?.edit && !isCreating)
      }}
      okText={isCreating ? t('common:button.create') : t('common:button.update')}
    >
      <Context.Provider value={{ isCreating }}>
        <FormControllerTabs value={tab} onChange={onChangeTab} form={jobForm} tabs={tabs} />
      </Context.Provider>
    </DialogMain>
  )
}

export default DialogJobCreateEdit
