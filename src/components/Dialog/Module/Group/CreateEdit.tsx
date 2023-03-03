import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import useStyles from './style'

import { Grid, Tabs, Tab } from '@material-ui/core'
import { Unless } from 'react-if'
import {
  SectionTimezone,
  FormControllerTextField,
  MalisPanel,
  DialogMain,
  AppTabHistoryLog,
  BtnHelp
} from '@/components'

import _ from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup'
import { groupStore } from '@/store/reducers'
import getValidationSchema from './validationSchema'

import type { GroupDetail } from '@/types/Group'
import type { HistoryLog } from '@/types/Common'

function GroupAddEditDialog() {
  const { t } = useTranslation('group')

  const [tab, setTab] = useState(0)

  const classes = useStyles()
  const dispatch = useDispatch()
  const dialogState = useSelector(groupStore.selectDialogState)
  const groupDetail = useSelector(groupStore.selectDetail)
  const permissions = useSelector(groupStore.selectPermissions)
  const { wiki_page } = useSelector(groupStore.selectInitDataForCE)

  const isCreating = _.isNil(groupDetail.id)

  const validationSchema = useMemo(() => getValidationSchema(t, isCreating), [isCreating])

  const groupForm = useForm<GroupDetail>({
    resolver: yupResolver(validationSchema),
    shouldUnregister: false
  })

  const formData = groupForm.getValues()

  useEffect(() => {
    groupForm.reset(groupDetail)
  }, [groupDetail])

  const onSubmitDialog = groupForm.handleSubmit((data) => {
    const payload = _.pick(data, ['group_id', 'name', 'description'])
    if (isCreating) {
      dispatch(groupStore.sagaCreate(payload))
    } else {
      const group = _.omit(payload, 'group_id') as GroupDetail
      dispatch(groupStore.sagaUpdate({ formData: group, id: data.id }))
    }
  })

  const onCloseDialog = () => {
    groupForm.clearErrors()
    dispatch(groupStore.sagaCloseDialog())
    setTab(0)
  }

  const onChangeTab = (event, newValue: number) => {
    setTab(newValue)
  }

  const handleChangeHistoryLogs = (data: HistoryLog[]) => {
    dispatch(groupStore.actions.setHistoryLogs(data))
  }

  return (
    <DialogMain
      open={dialogState.open}
      height={557}
      title={
        <BtnHelp title={isCreating ? t('form.title.create_group') : t('form.title.update_group')} href={wiki_page} />
      }
      onOk={onSubmitDialog}
      onClose={onCloseDialog}
      okButtonProps={{
        disabled: dialogState.loading || (!permissions?.edit && !isCreating)
      }}
      okText={isCreating ? t('common:button.create') : t('common:button.update')}
      loading={dialogState.loading}
    >
      <Tabs value={tab} onChange={onChangeTab}>
        <Tab label={t('common:tab.general')} />
        <Tab label={t('common:tab.history')} disabled={isCreating} />
      </Tabs>

      <MalisPanel value={tab} index={0}>
        <Grid container spacing={2} className={classes.wrapDialog}>
          <Grid item xs={12}>
            <FormControllerTextField
              control={groupForm.control}
              required
              name="group_id"
              label="Group #"
              disabled={!isCreating}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControllerTextField control={groupForm.control} required name="name" label="Group Name" />
          </Grid>

          <Grid item xs={12}>
            <FormControllerTextField
              control={groupForm.control}
              name="description"
              label="Description"
              multiline
              rows={10}
            />
          </Grid>

          <Unless condition={isCreating}>
            <SectionTimezone value={formData} />
          </Unless>
        </Grid>
      </MalisPanel>
      <MalisPanel value={tab} index={1}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppTabHistoryLog
              isOpenDialog={dialogState.open}
              data={dialogState.historyLogs}
              onChange={handleChangeHistoryLogs}
              entityId={groupDetail.id}
              entity="group"
            />
          </Grid>
        </Grid>
      </MalisPanel>
    </DialogMain>
  )
}

export default GroupAddEditDialog
