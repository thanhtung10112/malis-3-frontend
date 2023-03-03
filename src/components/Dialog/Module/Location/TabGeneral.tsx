import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'next-i18next'
import useStyles from './style'

import { Grid } from '@material-ui/core'
import { When } from 'react-if'
import {
  FormControllerTextField,
  FormControllerAutocomplete,
  InfoIcon,
  DocumentIcon,
  SectionTimezone,
  FormControllerTabs
} from '@/components'

import TabMainAddress from './TabMainAddress'
import TabSecondaryAddress from './TabSecondaryAddress'

import { locationStore } from '@/store/reducers'

import type { LocationDetail } from '@/types/Location'

const TabGeneral: React.FC = () => {
  const { t } = useTranslation('location')
  const classes = useStyles()
  const locationForm = useFormContext<LocationDetail>()

  const [childTab, setChildTab] = useState(0)

  const dispatch = useDispatch()
  const dialogState = useSelector(locationStore.selectDialogState)
  const { parameters } = useSelector(locationStore.selectInitDataForCE)
  const permissions = useSelector(locationStore.selectPermissions)
  const locationDetail = useSelector(locationStore.selectDetail)

  const handleGetNextCode = () => {
    const currentValues = locationForm.getValues()
    dispatch(locationStore.sagaGetNextCode(currentValues))
  }

  const handleChangeChildTab = (event, nextTab) => {
    setChildTab(nextTab)
  }

  const officeTab = {
    label: t('form.tab.main_address'),
    panel: <TabMainAddress />,
    errorKey: ['office_email', 'office_zip']
  }

  const workshopWarehouseTab = {
    label: t('form.tab.secondary_address'),
    panel: <TabSecondaryAddress />,
    errorKey: ['workshop_email', 'remark']
  }

  const tabs = [officeTab, workshopWarehouseTab]

  const renderOption = (option) => `${option.parameter_id} - ${option.description}`

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControllerTextField
            control={locationForm.control}
            label={t('form.code')}
            name="location_id"
            required
            generateCode
            autoFocus={!dialogState.editMode}
            disabled={dialogState.editMode}
            loading={dialogState.loading}
            onGenerateCode={handleGetNextCode}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControllerAutocomplete
            control={locationForm.control}
            name="language"
            options={parameters.PLLA}
            renderOption={renderOption}
            label={t('form.language')}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <FormControllerAutocomplete
            control={locationForm.control}
            name="location_type"
            options={parameters.TYLO}
            renderOption={renderOption}
            disabled={!permissions?.change_type && dialogState.editMode}
            label={t('form.type')}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <FormControllerTextField control={locationForm.control} name="name" required label={t('form.name')} />
        </Grid>

        <Grid item xs={12}>
          <FormControllerTextField
            control={locationForm.control}
            multiline
            rows={3}
            name="comment"
            label={t('form.comment')}
          />
        </Grid>
      </Grid>

      <section className={classes.document__container}>
        <InfoIcon className={classes.document__iconText} />
        <div className={classes.document__attach}>
          <DocumentIcon className={classes.document__iconText} />
          <span className={classes.document__iconText}>{t('common:attach_documents')}</span>
        </div>
      </section>

      <FormControllerTabs value={childTab} onChange={handleChangeChildTab} form={locationForm} tabs={tabs} />

      <When condition={dialogState.editMode}>
        <SectionTimezone style={{ padding: 0 }} value={locationDetail} />
      </When>
    </>
  )
}

export default TabGeneral
