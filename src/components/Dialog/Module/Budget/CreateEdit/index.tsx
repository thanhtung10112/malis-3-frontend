import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, FormProvider } from 'react-hook-form'

import { Tabs, Tab } from '@material-ui/core'
import { MalisPanel, DialogMain, BtnHelp } from '@/components'
import TabGeneral from '../TabGeneral'

import { budgetActions } from '@/store/reducers'
import getValidationSchema from '../validationSchema'

import _ from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup'
import * as constant from '@/utils/constant'
import AppNumber from '@/helper/AppNumber'

function BudgetAddEditDialog() {
  const { t } = useTranslation('budget')

  const [tab, setTab] = useState(0)

  const dispatch = useDispatch()
  const dialogState = useSelector(budgetActions.selectDialogState)
  const budgetDetail = useSelector(budgetActions.selectBudgetDetail)
  const permissions = useSelector(budgetActions.selectPermissions)
  const userPuco = useSelector(budgetActions.selectUserPuco)
  const { wiki_page } = useSelector(budgetActions.selectInitDataForCE)

  const validationSchema = useMemo(() => getValidationSchema(t), [])

  const budgetForm = useForm({
    shouldUnregister: false,
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    budgetForm.reset(budgetDetail)
  }, [budgetDetail])

  useEffect(() => {
    if (_.isNumber(userPuco.value)) {
      dispatch(budgetActions.setBudgetDetail({ puco: userPuco.value }))
    } else {
      dispatch(budgetActions.setBudgetDetail({ puco: null }))
    }
  }, [userPuco])

  const onChangeTab = (_, tab) => {
    setTab(tab)
  }

  const onSubmitForm = budgetForm.handleSubmit((data) => {
    const payload = _.omit(data, [...constant.removalProperties, 'currency']) as any
    payload.amount = AppNumber.convertToNumber(payload.amount, constant.budgetAmountFormat)
    if (dialogState.isEdit) {
      const newPayload = _.omit(payload, ['budget_id', 'job_id'])
      newPayload.budget_id_pk = data.id
      dispatch(budgetActions.update(newPayload as any))
    } else {
      dispatch(budgetActions.create(payload as any))
    }
  })

  const onClose = () => {
    setTab(0)
    budgetForm.clearErrors()
    dispatch(budgetActions.closeDialog())
  }

  return (
    <DialogMain
      open={dialogState.isOpen}
      loading={dialogState.isLoading}
      onOk={onSubmitForm}
      onClose={onClose}
      okText={dialogState.isEdit ? t('common:button.update') : t('common:button.create')}
      okButtonProps={{
        disabled: dialogState.isLoading || (!permissions?.edit && dialogState.isEdit)
      }}
      title={<BtnHelp title={dialogState.isEdit ? t('form.title.update') : t('form.title.create')} href={wiki_page} />}
    >
      <Tabs value={tab} onChange={onChangeTab}>
        <Tab label={t('common:tab.general')} />
        <Tab label={t('common:tab.history')} disabled />
      </Tabs>
      <FormProvider {...budgetForm}>
        <MalisPanel value={tab} index={0}>
          <TabGeneral />
        </MalisPanel>
      </FormProvider>
    </DialogMain>
  )
}

export default BudgetAddEditDialog
