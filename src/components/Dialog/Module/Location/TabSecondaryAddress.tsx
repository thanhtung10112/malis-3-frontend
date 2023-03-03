import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'next-i18next'

import { Grid } from '@material-ui/core'
import { FormControllerTextField } from '@/components'

const TabWorkshopWarehouse: React.FC = () => {
  const { t } = useTranslation('location')

  const locationForm = useFormContext()
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControllerTextField
            control={locationForm.control}
            name="workshop_address1"
            label={t('form.address', { order: 1 })}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControllerTextField
            control={locationForm.control}
            name="workshop_address2"
            label={t('form.address', { order: 2 })}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControllerTextField control={locationForm.control} name="workshop_city" label={t('form.city')} />
        </Grid>

        <Grid item xs={6}>
          <FormControllerTextField control={locationForm.control} name="workshop_phone" label={t('form.phone')} />
        </Grid>

        <Grid item xs={6}>
          <FormControllerTextField control={locationForm.control} name="workshop_email" label={t('form.email')} />
        </Grid>

        <Grid item xs={6}>
          <FormControllerTextField control={locationForm.control} name="workshop_fax" label={t('form.fax')} />
        </Grid>

        <Grid item xs={12}>
          <FormControllerTextField control={locationForm.control} name="remark" label="Remark" />
        </Grid>
      </Grid>
    </>
  )
}

export default TabWorkshopWarehouse
