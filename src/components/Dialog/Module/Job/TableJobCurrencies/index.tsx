import { useState, useEffect, memo } from 'react'

import { Grid, Button } from '@material-ui/core'

import {
  DataTable,
  AppTitle,
  AppAutocompleteStyled,
  DeleteIcon,
  DataTableCellExpand,
  DataTableNumberField
} from '@/components'

import { useSelector } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import useStyles from './styles'
import { useTranslation } from 'next-i18next'

import _ from 'lodash'
import immer from 'immer'
import { currencyRateFormat } from '@/utils/constant'
import * as columnProperties from '@/utils/columnProperties'
import AppNumber from '@/helper/AppNumber'
import { jobStore } from '@/store/reducers'
import * as yup from 'yup'

import type { JobDetail, JobCurrency } from '@/types/Job'
import type { GridColumns } from '@material-ui/data-grid'

function TableJobCurrencies() {
  const classes = useStyles()
  const { t } = useTranslation('currency')

  const jobForm = useFormContext<JobDetail>()
  const watchJobCurrencies = jobForm.watch('job_currencies', [])

  const { currencies } = useSelector(jobStore.selectInitDataForCE)
  const jobDetail = useSelector(jobStore.selectDetail)

  const [selectedCurrencies, setSelectedCurrencies] = useState<number[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<JobCurrency>(null)

  useEffect(() => {
    setSelectedCurrency(null)
  }, [jobDetail])

  const onSelectJobCurrency = (event, value: JobCurrency) => {
    setSelectedCurrency(value)
    const newJobCurrencies = immer(watchJobCurrencies, (draft) => {
      draft.push(value)
    })
    jobForm.setValue('job_currencies', newJobCurrencies)
  }

  const onSelectedCurrencies = ({ selectionModel }) => {
    setSelectedCurrencies(selectionModel)
  }

  const onDeleteSelectedCurrencies = () => {
    const newJobCurrencies = watchJobCurrencies.filter(
      (currency) => !selectedCurrencies.some((selC) => selC === currency.id)
    )
    jobForm.setValue('job_currencies', newJobCurrencies)
    setSelectedCurrencies([])
  }

  const onChangeRateCurrency = (id, rate) => {
    const newJobCurrencies = immer(watchJobCurrencies, (draft) => {
      const index = _.findIndex(draft, { id })
      draft[index].rate = rate
    })
    jobForm.setValue('job_currencies', newJobCurrencies)
  }

  const columns: GridColumns = [
    {
      field: 'description',
      headerName: 'Currency',
      flex: 0.7,
      sortable: false
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.numberColumn,
      ...columnProperties.editCell('Rate'),
      field: 'rate',
      flex: 0.3,
      renderCell(params) {
        const value = AppNumber.format(params.value, currencyRateFormat)
        return <DataTableCellExpand value={value} width={params.colDef.width} />
      },
      renderEditCell(params) {
        return (
          <DataTableNumberField
            params={params}
            onChangeValue={onChangeRateCurrency}
            decimalScale={currencyRateFormat.precision}
            fixedDecimalScale={currencyRateFormat.precision}
            rules={yup
              .number()
              .nullable()
              .required(t('validation_message.rate_required'))
              .min(currencyRateFormat.min, t('validation_message.rate_range'))
              .max(currencyRateFormat.max, t('validation_message.rate_range'))}
          />
        )
      }
    }
  ]

  return (
    <>
      <Grid item xs={12}>
        <AppTitle label="Currency Rate" />
      </Grid>

      <Grid item xs={12}>
        <div className={classes.currencyTop}>
          <AppAutocompleteStyled
            value={selectedCurrency}
            width={280}
            height={30}
            label="Currency"
            options={currencies}
            renderOption={(option) => option.description}
            className={classes.currencyOption}
            onChange={onSelectJobCurrency}
            getOptionDisabled={(option) => watchJobCurrencies.some((currency) => currency.id === option.id)}
          />
          <Button
            startIcon={<DeleteIcon />}
            className={classes.deleteButton}
            disabled={selectedCurrencies.length <= 0}
            onClick={onDeleteSelectedCurrencies}
          >
            {t('common:button.delete')}
          </Button>
        </div>
      </Grid>

      <Grid item xs={12} className={classes.currencyTable}>
        <DataTable
          hideFooter
          disableSelectionOnClick
          disableColumnMenu
          checkboxSelection
          selectionModel={selectedCurrencies}
          columns={columns}
          rows={watchJobCurrencies}
          tableHeight={110}
          onSelectionModelChange={onSelectedCurrencies}
        />
      </Grid>
    </>
  )
}

export default memo(TableJobCurrencies)
