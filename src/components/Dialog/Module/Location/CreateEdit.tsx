import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'

import { Grid } from '@material-ui/core'
import { TableExtendedProperties, DialogMain, AppTabHistoryLog, FormControllerTabs, BtnHelp } from '@/components/index'

import TabGeneral from './TabGeneral'
import TabSpecialties from './TabSpecialties'

import _ from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup'

import getValidationSchema from './validationSchema'
import { locationStore } from '@/store/reducers'
import { removalProperties } from '@/utils/constant'

import type { LocationDetail } from '@/types/Location'
import type { HistoryLog } from '@/types/Common'

function LocationDialog() {
  const { t } = useTranslation('location')

  const validationSchema = useMemo(() => getValidationSchema(t), [])
  const locationForm = useForm<LocationDetail>({
    shouldUnregister: false,
    resolver: yupResolver(validationSchema)
  })

  const [tab, setTab] = useState(0)

  const dispatch = useDispatch()
  const dialogState = useSelector(locationStore.selectDialogState)
  const locationDetail = useSelector(locationStore.selectDetail)
  const { parameters, wiki_page } = useSelector(locationStore.selectInitDataForCE)
  const permissions = useSelector(locationStore.selectPermissions)

  const titleDialog = dialogState.editMode ? t('form.title.update_location') : t('form.title.create_location')

  useEffect(() => {
    locationForm.reset(locationDetail)
    setTab(0)
  }, [locationDetail])

  const onChangeTab = (_, newValue: number) => {
    setTab(newValue)
  }

  const onHandleSubmit = locationForm.handleSubmit((data) => {
    const payload = _.omit(data, [...removalProperties, 'use_in_job']) as LocationDetail
    if (dialogState.editMode) {
      dispatch(locationStore.sagaUpdate({ location: payload, id: data.id }))
    } else {
      dispatch(locationStore.sagaCreate(payload))
    }
  })

  const onClose = () => {
    locationForm.clearErrors()
    dispatch(locationStore.sagaCloseDialog())
  }

  const handleChangeHistoryLogs = (data: HistoryLog[]) => {
    dispatch(locationStore.actions.setHistoryLogs(data))
  }

  const generalTab = {
    label: t('common:tab.general'),
    errorKey: [
      'location_id',
      'language',
      'location_type',
      'name',
      'office_email',
      'office_zip',
      'comment',
      'office_email',
      'office_zip',
      'workshop_email'
    ],
    panel: <TabGeneral />
  }

  const specialtiesTab = {
    label: t('form.tab.specialties'),
    panel: <TabSpecialties />
  }

  const extendedPropertiesTab = {
    label: t('common:tab.extended_properties'),
    panel: (
      <Grid container>
        <Grid item xs={12}>
          <TableExtendedProperties
            control={locationForm.control}
            name="additional_attributes"
            tableHeight={505}
            propertiesList={parameters.LOAT}
            editMode={dialogState.editMode}
            parameterName="LOAT"
          />
        </Grid>
      </Grid>
    )
  }

  const historyTab = {
    label: t('common:tab.history'),
    panel: (
      <AppTabHistoryLog
        isOpenDialog={dialogState.open}
        data={dialogState.historyLogs}
        onChange={handleChangeHistoryLogs}
        entityId={locationDetail.id}
        entity="location"
      />
    ),
    disabled: !dialogState.editMode
  }

  const tabs = [generalTab, specialtiesTab, extendedPropertiesTab, historyTab]

  return (
    <DialogMain
      open={dialogState.open}
      title={<BtnHelp title={titleDialog} href={wiki_page} />}
      loading={dialogState.loading}
      onOk={onHandleSubmit}
      onClose={onClose}
      height={dialogState.editMode ? 627 : 580}
      okButtonProps={{
        disabled: dialogState.loading || (!permissions?.edit && dialogState.editMode)
      }}
      okText={dialogState.editMode ? t('common:button.update') : t('common:button.create')}
    >
      <FormControllerTabs value={tab} onChange={onChangeTab} form={locationForm} tabs={tabs} />
    </DialogMain>
  )
}

export default LocationDialog
