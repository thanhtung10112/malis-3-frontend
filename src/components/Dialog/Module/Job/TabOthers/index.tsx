import { useSelector } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import useStyles from './styles'
import useDialogContext from '../Context/useDialogContext'

import { Grid } from '@material-ui/core'
import { AppTitle, TableExtendedProperties, AppImageField, FormControllerTextField } from '@/components'
import TableJobCurrencies from '../TableJobCurrencies'

import { jobStore } from '@/store/reducers'

import type { JobDetail } from '@/types/Job'

function TabOthers() {
  const classes = useStyles()
  const { isCreating } = useDialogContext()

  const { parameters } = useSelector(jobStore.selectInitDataForCE)

  const jobForm = useFormContext<JobDetail>()
  const watchLogo = jobForm.watch('logo', '')

  const handleChangeLogo = ({ file }) => {
    jobForm.setValue('logo', file)
  }

  return (
    <Grid container>
      <Grid item xs={6}>
        <Grid container>
          <Grid item xs={12}>
            <AppTitle label="Logistic" />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} className={classes.section}>
              <Grid item xs={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControllerTextField label="Contract Number" name="contract_no" control={jobForm.control} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControllerTextField
                      multiline
                      rows={5}
                      label="Contract Description"
                      name="contract_desc"
                      control={jobForm.control}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControllerTextField label="L/C" name="credit_letter" control={jobForm.control} />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <AppImageField
                  width="90%"
                  height={167}
                  image={watchLogo}
                  onChange={handleChangeLogo}
                  error={jobForm.errors.logo?.message}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container className={classes.marginTopSection}>
          <TableJobCurrencies />
        </Grid>
      </Grid>

      <Grid item xs={6}>
        <Grid container>
          <Grid item xs={12}>
            <AppTitle label="Extended Properties" />
          </Grid>

          <Grid item xs={12} className={classes.extendedPropertyTable}>
            <TableExtendedProperties
              propertiesList={parameters.JOAT}
              control={jobForm.control}
              name="additional_attributes"
              editMode={!isCreating}
              parameterName="JOAT"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default TabOthers
