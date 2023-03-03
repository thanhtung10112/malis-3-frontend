import React from 'react'

import { Grid, FormControlLabel, Checkbox, Typography } from '@material-ui/core'

import { FormControllerTextField } from '@/components/index'

import { Unless, When } from 'react-if'

import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import useStyles from './styles'

import { makeAListActions } from '@/store/reducers'
import getValidationSchema from '../validationSchema'

function SectionGeneralInfo({ isSharedMode }) {
  const { t } = useTranslation('make_a_list')
  const classes = useStyles()
  const validationSchema = React.useMemo(() => getValidationSchema(t), [])

  const presetDetail = useSelector(makeAListActions.selectPresetDetail)

  const makeAListForm = useFormContext()
  const watchValues = makeAListForm.watch()

  const onToggleOption = (_, checked: boolean) => {
    makeAListForm.setValue('is_user_default', checked)
  }

  return (
    <>
      <Grid item xs={9} className={classes.textField}>
        <FormControllerTextField
          label="Name"
          name="name"
          required
          disabled={isSharedMode}
          control={makeAListForm.control}
          rules={validationSchema.name}
        />
      </Grid>

      <Unless condition={watchValues.is_system_default}>
        <Grid item xs={3}>
          <FormControlLabel
            className={classes.textField}
            disabled={false}
            control={
              <Checkbox
                className={classes.chkSetAsDefault}
                name="is_user_default"
                color="primary"
                onChange={onToggleOption}
                checked={watchValues.is_user_default}
              />
            }
            label={
              <Typography component="span" variant="body2">
                {t('common:button.set_as_default')}
              </Typography>
            }
          />
        </Grid>
      </Unless>

      <Grid item xs={12}>
        <FormControllerTextField
          control={makeAListForm.control}
          rules={validationSchema.description}
          label="Comment"
          disabled={isSharedMode}
          name="description"
          multiline
          rows={3}
        />
      </Grid>
      <When condition={Boolean(presetDetail.created_at)}>
        <Grid item xs={6}>
          <Typography variant="body1" component="span" className={classes.timezoneTitle}>
            Created by:{' '}
          </Typography>
          <Typography variant="body1" component="span">
            {watchValues.created_by} {watchValues.created_at}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1" component="span" className={classes.timezoneTitle}>
            Last modified:{' '}
          </Typography>
          <Typography variant="body1" component="span">
            {watchValues.updated_by} {watchValues.updated_at}
          </Typography>
        </Grid>
      </When>
    </>
  )
}

export default SectionGeneralInfo
