import React from 'react'

import { Grid, FormControl, Tooltip, TextField } from '@material-ui/core'

import { When } from 'react-if'

import {
  FormControllerAutocomplete,
  SectionTimezone,
  FormControllerTextField,
  FormControllerNumberField
} from '@/components'

import useStyles from './styles'
import { useSelector } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'next-i18next'

import { budgetActions } from '@/store/reducers'

import _ from 'lodash'
import parseHTML from 'html-react-parser'

function TabGeneral() {
  const classes = useStyles()
  const { t } = useTranslation('budget')

  const budgetForm = useFormContext()
  const watchPuco = budgetForm.watch('puco', null)

  const dialogState = useSelector(budgetActions.selectDialogState)
  const userJob = useSelector(budgetActions.selectUserJob)
  const initDataForCreateEdit = useSelector(budgetActions.selectInitDataCreateEdit)

  const tooltipForCode = React.useMemo(() => parseHTML(t('tooltip.code')), [])

  React.useEffect(() => {
    if (watchPuco) {
      const findPuco = _.find(initDataForCreateEdit.puco_list, {
        value: watchPuco
      })
      budgetForm.setValue('currency', findPuco?.properties?.currency || '')
    }
  }, [watchPuco])

  return (
    <>
      <Grid container spacing={2} className={classes.wrapDialog}>
        <Grid item xs={12}>
          <TextField name="job_id" label={t('form.label.job')} required disabled value={userJob?.description || ''} />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <Tooltip title={tooltipForCode}>
              <FormControllerTextField
                label={t('form.label.code')}
                name="budget_id"
                required
                control={budgetForm.control}
                transformValue={(value) => value.toUpperCase()}
                disabled={dialogState.isEdit}
                InputProps={{
                  readOnly: dialogState.isEdit,
                  className: dialogState.isEdit ? 'Mui-disabled' : undefined
                }}
              />
            </Tooltip>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControllerAutocomplete
            disableClearable
            required
            label={t('form.label.puco')}
            name="puco"
            primaryKeyOption="value"
            options={initDataForCreateEdit.puco_list}
            control={budgetForm.control}
            renderOption={(option) => option.description}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControllerTextField
            disabled
            label={t('form.label.currency')}
            name="currency"
            control={budgetForm.control}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControllerNumberField
            label={t('form.label.amount')}
            name="amount"
            required
            control={budgetForm.control}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControllerTextField
            label={t('form.label.description')}
            name="description"
            multiline
            rows={10}
            control={budgetForm.control}
          />
        </Grid>

        <When condition={dialogState.isEdit}>
          <SectionTimezone value={budgetForm.getValues()} />
        </When>
      </Grid>
    </>
  )
}

export default TabGeneral
