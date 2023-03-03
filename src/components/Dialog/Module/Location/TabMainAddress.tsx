import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'

import { Grid } from '@material-ui/core'
import { FormControllerTextField, FormControllerAutocomplete } from '@/components'

import { locationStore } from '@/store/reducers'

const TabOffice: React.FC = () => {
  const { t } = useTranslation('location')

  const locationForm = useFormContext()

  const { parameters } = useSelector(locationStore.selectInitDataForCE)

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControllerTextField
            control={locationForm.control}
            name="office_address1"
            label={t('form.address', { order: 1 })}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControllerTextField
            control={locationForm.control}
            name="office_address2"
            label={t('form.address', { order: 2 })}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControllerTextField
            control={locationForm.control}
            name="office_phone"
            label={t('form.phone', { order: 1 })}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControllerAutocomplete
            control={locationForm.control}
            name="office_country"
            options={parameters.CTRY}
            renderOption={(option) => `${option.parameter_id} - ${option.description}`}
            label={t('form.country')}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControllerTextField control={locationForm.control} name="office_city" label={t('form.city')} />
        </Grid>

        <Grid item xs={6}>
          <FormControllerTextField control={locationForm.control} name="office_zip" label={t('form.zipcode')} />
        </Grid>

        <Grid item xs={6}>
          <FormControllerTextField control={locationForm.control} name="office_state" label={t('form.state')} />
        </Grid>

        <Grid item xs={6}>
          <FormControllerTextField control={locationForm.control} name="office_email" label={t('form.email')} />
        </Grid>

        <Grid item xs={6}>
          <FormControllerTextField control={locationForm.control} name="office_fax" label={t('form.fax')} />
        </Grid>
      </Grid>
    </>
  )
}

export default TabOffice
