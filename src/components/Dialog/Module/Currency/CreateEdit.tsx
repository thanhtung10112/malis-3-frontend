import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import useStyles from './styles'
import { useForm } from 'react-hook-form'

import { Grid, Typography } from '@material-ui/core'

import SyncAltIcon from '@material-ui/icons/SyncAlt'

import {
  FormControllerAutocomplete,
  FormControllerTextField,
  SectionTimezone,
  DialogMain,
  AppTabHistoryLog,
  FormControllerTabs,
  FormControllerNumberField,
  BtnHelp
} from '@/components'

import { Unless } from 'react-if'

import _ from 'lodash'
import { currencyStore } from '@/store/reducers'
import { currencyRateFormat } from '@/utils/constant'
import clsx from 'clsx'
import { yupResolver } from '@hookform/resolvers/yup'

import getValidationSchema from './validationSchema'

import type { CurrencyDetail } from '@/types/Currency'
import type { HistoryLog } from '@/types/Common'

function CurrencyAddEditDialog() {
  const { t } = useTranslation('currency')
  const classes = useStyles()
  const [tab, setTab] = useState(0)

  const dispatch = useDispatch()
  const dialogState = useSelector(currencyStore.selectDialogState)
  const initDataForCE = useSelector(currencyStore.selectInitDataForCE)
  const baseCurrency = useSelector(currencyStore.selectUserBaseCurrency)
  const currencyDetail = useSelector(currencyStore.selectDetail)
  const permissions = useSelector(currencyStore.selectPermissions)
  const { wiki_page } = useSelector(currencyStore.selectInitDataForCE)

  const isCreating = _.isNil(currencyDetail.id)

  const titleDialog = isCreating ? t('form.create_currency') : t('form.update_currency')

  const validationSchema = useMemo(() => getValidationSchema(t), [])

  const currencyForm = useForm<CurrencyDetail>({
    shouldUnregister: false,
    resolver: yupResolver(validationSchema)
  })

  const watchCurrencyId = currencyForm.watch('currency_id', '')
  const watchIsBaseRateMode = currencyForm.watch('is_base_rate_mode', false)

  const disableSwapRating = !isCreating && !currencyDetail.base_currency

  useEffect(() => {
    const resetData = { ...currencyDetail }
    if (_.isNil(currencyDetail.is_base_rate_mode)) {
      resetData.is_base_rate_mode = false
    }
    currencyForm.reset({
      ...resetData
    })
  }, [currencyDetail])

  const handleClose = () => {
    currencyForm.clearErrors()
    setTab(0)
    dispatch(currencyStore.sagaCloseDialog())
  }

  const onSwapRateMode = () => {
    if (!disableSwapRating) {
      currencyForm.setValue('is_base_rate_mode', !watchIsBaseRateMode)
      currencyForm.setValue('multiplier', null)
      currencyForm.setValue('rate', '')
      currencyForm.unregister('rate')
      currencyForm.clearErrors(['rate', 'multiplier'])
    }
  }

  const onSubmitData = currencyForm.handleSubmit((formData) => {
    const data = _.pick(formData, [
      'base_currency',
      'currency_id',
      'description',
      'is_base_rate_mode',
      'multiplier',
      'rate',
      'round_to'
    ])
    if (isCreating) {
      data.base_currency = baseCurrency.id
      dispatch(currencyStore.sagaCreate(data as CurrencyDetail))
    } else {
      dispatch(currencyStore.sagaUpdate({ id: formData.id, formData: data }))
    }
  })

  const handleChangeTab = (_, nextTab: number) => {
    setTab(nextTab)
  }

  const handleChangeHistoryLogs = (data: HistoryLog[]) => {
    dispatch(currencyStore.actions.setHistoryLogs(data))
  }

  const TabGeneral = (
    <>
      <Grid container spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={12}>
          <FormControllerTextField
            name="currency_id"
            control={currencyForm.control}
            label={t('label.code')}
            required
            disabled={!isCreating}
            transformValue={(value) => _.toUpper(value)}
            limitText={3}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControllerAutocomplete
            disableClearable
            control={currencyForm.control}
            name="round_to"
            options={initDataForCE.round_to_options}
            renderOption={(option) => option.description}
            label={t('label.round_to')}
            required
          />
        </Grid>
      </Grid>

      <Grid className={classes.gridTop} container spacing={2}>
        <Grid item xs={5} className={classes.wrapContent}>
          <FormControllerAutocomplete
            disableClearable
            control={currencyForm.control}
            name="multiplier"
            options={initDataForCE.multiplier_options}
            disabled={!isCreating && !currencyDetail.base_currency}
            renderOption={(option) => option.description}
            primaryKeyOption="value"
            style={{ width: '100%' }}
            label="Multiplier"
            required
          />
          <Typography display="inline" variant="caption" className={classes.multiplierLabel}>
            {watchIsBaseRateMode ? baseCurrency.currency_id : watchCurrencyId}
          </Typography>
        </Grid>
        <Grid item xs={2} className={classes.wrapSymbol}>
          <SyncAltIcon
            className={clsx(classes.syncAltIcon, disableSwapRating && classes.disabled)}
            onClick={onSwapRateMode}
          />
          <Typography display="inline" variant="caption" className={classes.symbolEqual}>
            =
          </Typography>
        </Grid>
        <Grid item xs={5} className={classes.wrapContent}>
          <FormControllerNumberField
            control={currencyForm.control}
            name="rate"
            label="Rate"
            required
            disabled={!isCreating && !currencyDetail.base_currency}
            decimalScale={currencyRateFormat.precision}
            fixedDecimalScale={currencyRateFormat.precision}
          />
          <Typography display="inline" variant="caption" className={classes.multiplierLabel}>
            {watchIsBaseRateMode ? watchCurrencyId : baseCurrency.currency_id}
          </Typography>
        </Grid>
      </Grid>

      <Grid className={classes.gridTop} container spacing={1}>
        <Grid item xs={12}>
          <FormControllerTextField
            control={currencyForm.control}
            label={t('label.description')}
            multiline
            rows={12}
            name="description"
          />
        </Grid>
      </Grid>

      <Unless condition={isCreating}>
        <SectionTimezone value={currencyDetail} />
      </Unless>
    </>
  )

  const generalTab = {
    label: t('common:tab.general'),
    panel: TabGeneral,
    errorKey: ['currency_id', 'multiplier', 'rate', 'round_to', 'description']
  }

  const historyTab = {
    label: t('common:tab.history'),
    disabled: isCreating,
    panel: (
      <AppTabHistoryLog
        isOpenDialog={dialogState.open}
        data={dialogState.historyLogs}
        onChange={handleChangeHistoryLogs}
        entityId={currencyDetail.id}
        tableHeight={250}
        entity="currency"
      />
    )
  }
  const tabs = [generalTab, historyTab]

  return (
    <DialogMain
      open={dialogState.open}
      title={<BtnHelp title={titleDialog} href={wiki_page} />}
      onOk={onSubmitData}
      onClose={handleClose}
      loading={dialogState.loading}
      height={470}
      okButtonProps={{
        disabled: dialogState.loading || (!permissions?.edit && !isCreating)
      }}
      okText={isCreating ? t('common:button.create') : t('common:button.update')}
    >
      <FormControllerTabs value={tab} onChange={handleChangeTab} form={currencyForm} tabs={tabs} />
    </DialogMain>
  )
}

export default CurrencyAddEditDialog
