import { useSelector, useDispatch } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { userStore } from '@/store/reducers'

import { Grid, Typography, makeStyles } from '@material-ui/core'
import { Unless, When } from 'react-if'
import {
  FormControllerAutocomplete,
  FormControllerTextField,
  FormControllerPasswordField,
  FormControllerDatePicker,
  SectionTimezone
} from '@/components'

import _ from 'lodash'

import type { UserDetail } from '@/types/User'

const useStyles = makeStyles((theme) => ({
  resetPassword: {
    cursor: 'pointer',
    opacity: 0.6,
    textDecoration: 'underline',
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.standard,
      easing: 'easing-out'
    }),
    '&:hover': {
      opacity: 1
    }
  }
}))

const TabGeneral = () => {
  const classes = useStyles()
  const { t } = useTranslation('user')

  const userForm = useFormContext<UserDetail>()
  const watchValidFrom = userForm.watch('valid_from', null)
  const watchValidUntil = userForm.watch('valid_until', null)

  const dispatch = useDispatch()
  const { parameters, ...initDataForCE } = useSelector(userStore.selectInitDataForCE)
  const userDetail = useSelector(userStore.selectDetail)

  const isCreating = _.isNil(userDetail.id)

  const handleOpenResetPwdDialog = () => {
    dispatch(userStore.actions.setResetPwdDialogOpen(true))
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <FormControllerTextField
          control={userForm.control}
          required
          name="user_id"
          label="Username"
          autoFocus={isCreating}
          disabled={!isCreating}
        />
      </Grid>

      <Grid item xs={6}>
        <FormControllerTextField control={userForm.control} name="user_abb" label="User Abbr." />
      </Grid>

      <When condition={isCreating}>
        <Grid item xs={12}>
          <FormControllerPasswordField
            control={userForm.control}
            required
            type="password"
            name="password"
            label="Password"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControllerTextField
            control={userForm.control}
            required
            type="password"
            name="confirm_password"
            label="Confirm Password"
          />
        </Grid>
      </When>

      <Grid item xs={12}>
        <FormControllerTextField control={userForm.control} required name="first_name" label="First name" />
      </Grid>

      <Grid item xs={12}>
        <FormControllerTextField control={userForm.control} required name="last_name" label="Last name" />
      </Grid>

      <Grid item xs={12}>
        <FormControllerTextField control={userForm.control} name="email" label="Email" />
      </Grid>

      <Grid item xs={12}>
        <FormControllerAutocomplete
          getOptionSelected={(option, value) => option.id === value}
          closeIcon={null}
          control={userForm.control}
          name="puco"
          options={parameters.PUCO}
          renderOption={({ parameter_id, description }) => `${parameter_id} - ${description}`}
          label="Purchasing company"
          required
        />
      </Grid>

      <Grid item xs={12}>
        <FormControllerAutocomplete
          getOptionSelected={(option, value) => option.id === value}
          closeIcon={null}
          control={userForm.control}
          name="default_language"
          options={parameters.PLLA}
          renderOption={({ parameter_id, description }) => `${parameter_id} - ${description}`}
          label="Default language"
          required
        />
      </Grid>

      <Grid item xs={6}>
        <FormControllerDatePicker
          name="valid_from"
          label="Valid from"
          control={userForm.control}
          maxDate={watchValidUntil}
        />
      </Grid>

      <Grid item xs={6}>
        <FormControllerDatePicker
          name="valid_until"
          label="Valid until"
          control={userForm.control}
          minDate={watchValidFrom}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControllerAutocomplete
          getOptionSelected={(option, value) => option.id === value}
          closeIcon={null}
          control={userForm.control}
          name="time_zone"
          options={initDataForCE.timezones}
          renderOption={(option) => option.description}
          label="Timezone"
          required
          getOptionLabel={(option) => {
            if (_.isString(option)) {
              const findOption = _.find(initDataForCE.timezones, {
                id: option
              })
              return (findOption as any)?.description
            }
            return option.description
          }}
        />
      </Grid>

      <Unless condition={isCreating}>
        <Grid item xs={12}>
          <Typography
            variant="inherit"
            display="block"
            onClick={handleOpenResetPwdDialog}
            className={classes.resetPassword}
          >
            {t('form.label.reset_password')}
          </Typography>
        </Grid>
        <SectionTimezone value={userDetail} />
      </Unless>

      <Grid item xs={12}>
        <div />
      </Grid>

      <Grid item xs={12}>
        <div />
      </Grid>

      <Grid item xs={12}>
        <div />
      </Grid>
    </Grid>
  )
}

export default TabGeneral
