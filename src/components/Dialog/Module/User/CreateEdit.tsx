import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import { userStore } from '@/store/reducers'

import { AppTabHistoryLog, DialogMain, FormControllerTabs, BtnHelp } from '@/components'

import { yupResolver } from '@hookform/resolvers/yup'
import _ from 'lodash'

import getValidationSchema from './validationSchema'

import TabGeneral from './TabGeneral'
import TabJobs from './TabJobs'
import TabGroups from './TabGroups'

import type { UserDetail } from '@/types/User'
import type { HistoryLog } from '@/types/Common'

const UserCreateEditDialog: React.FC = () => {
  const { t } = useTranslation('user')

  const [tab, setTab] = useState(0)

  const dispatch = useDispatch()
  const dialogState = useSelector(userStore.selectDialogState)
  const userDetail = useSelector(userStore.selectDetail)
  const permissions = useSelector(userStore.selectPermissions)
  const { wiki_page } = useSelector(userStore.selectInitDataForCE)

  const isCreating = _.isNil(userDetail.id)

  const title = isCreating ? t('form.title.create_user') : t('form.title.update_user')

  const validationSchema = useMemo(() => getValidationSchema(t, !isCreating), [isCreating])
  const userForm = useForm<UserDetail>({
    shouldUnregister: false,
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    userForm.reset(userDetail)
    setTab(0)
  }, [userDetail])

  const onChangeTab = (_, newValue) => {
    setTab(newValue)
  }

  const onHandleSubmit = userForm.handleSubmit((formData) => {
    formData.groups = formData.groups.map((item) => +item)
    formData.job_access = formData.job_access.map(({ job_id, note }) => ({
      job_id,
      note: note || '' // server returns null but they do not allow send null to body req
    }))
    if (!formData.valid_from) {
      formData.valid_from = null
    }
    if (!formData.valid_until) {
      formData.valid_until = null
    }
    const payload = _.pick(formData, [
      'default_language',
      'email',
      'first_name',
      'groups',
      'job_access',
      'last_name',
      'puco',
      'time_zone',
      'user_abb',
      'user_id',
      'password',
      'confirm_password',
      'login_page',
      'valid_from',
      'valid_until'
    ])
    if (isCreating) {
      dispatch(userStore.sagaCreate(payload as UserDetail))
    } else {
      dispatch(
        userStore.sagaUpdate({
          id: formData.id,
          formData: _.omit(payload, ['password', 'confirm_password', 'login_page']) as UserDetail
        })
      )
    }
  })

  const onCloseDialog = () => {
    dispatch(userStore.sagaCloseDialog())
    userForm.clearErrors()
  }

  const handleChangeHistoryLogs = (data: HistoryLog[]) => {
    dispatch(userStore.actions.setHistoryLogs(data))
  }

  const generalTab = {
    label: 'General',
    panel: <TabGeneral />,
    errorKey: [
      'user_id',
      'user_abb',
      'first_name',
      'last_name',
      'password',
      'confirm_password',
      'email',
      'time_zone',
      'puco',
      'default_language'
    ]
  }

  const groupsTab = {
    label: t('form.tab.groups'),
    panel: <TabGroups />
  }

  const jobsTab = {
    label: t('form.tab.jobs'),
    panel: <TabJobs />
  }

  const historyTab = {
    label: t('common:tab.history'),
    panel: (
      <AppTabHistoryLog
        isOpenDialog={dialogState.open}
        data={dialogState.historyLogs}
        onChange={handleChangeHistoryLogs}
        entityId={userDetail.id}
        tableHeight={255}
        entity="user"
      />
    ),
    disabled: isCreating
  }

  const tabs = [generalTab, groupsTab, jobsTab, historyTab]

  return (
    <DialogMain
      open={dialogState.open}
      title={<BtnHelp title={title} href={wiki_page} />}
      height={560}
      onOk={onHandleSubmit}
      onClose={onCloseDialog}
      okText={isCreating ? t('common:button.create') : t('common:button.update')}
      okButtonProps={{
        disabled: dialogState.loading || (!permissions?.edit && !isCreating)
      }}
      loading={dialogState.loading}
    >
      <FormControllerTabs value={tab} onChange={onChangeTab} form={userForm} tabs={tabs} />
    </DialogMain>
  )
}

export default UserCreateEditDialog
