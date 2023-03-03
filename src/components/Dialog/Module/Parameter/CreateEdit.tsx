import { useState, useMemo, useEffect } from 'react'

import { Tabs, Tab, Grid } from '@material-ui/core'
import { When } from 'react-if'

import {
  DialogMain,
  MalisPanel,
  AppTabHistoryLog,
  FormControllerTextField,
  FormControllerCheckbox,
  AppTextField,
  TableMultilingualDescription,
  SectionTimezone
} from '@/components'

import TableAttributes from './TableAttributes'

import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import _ from 'lodash'

import * as constants from '@/utils/constant'
import { parameterStore } from '@/store/reducers'

import type { ParameterInstance } from '@/types/Parameter'
import type { HistoryLog } from '@/types/Common'

function CreateEditParameterCode() {
  const { t } = useTranslation('parameter')
  const router = useRouter()
  const paramTypeId = router.query.param_type_id as string

  const [tab, setTab] = useState(0)

  const dispatch = useDispatch()
  const dialogState = useSelector(parameterStore.selectDialogState)
  const parameterDetail = useSelector(parameterStore.selectDetail)
  const initParameter = useSelector(parameterStore.selectInitParameter)
  const initDataForCE = useSelector(parameterStore.selectInitDataForCE)
  const permissions = useSelector(parameterStore.selectPermissions)

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        parameter_id: yup
          .string()
          .required(t('validation_message.parameter_id_required'))
          .max(8, t('validation_message.parameter_id_required_max'))
          .matches(constants.REGEX_ALPHA_NUMERIC_ONLY, t('validation_message.parameter_id_match')),
        description: yup.string().nullable().max(80, t('validation_message.description_max')),
        order: yup
          .string()
          .trim()
          .nullable()
          .matches(/^\d+$/, {
            message: t('validation_message.order_type'),
            excludeEmptyString: true
          })
          .default(null)
      }),
    [t]
  )

  const parameterForm = useForm<ParameterInstance>({
    shouldUnregister: false,
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    parameterForm.reset(parameterDetail)
  }, [parameterDetail, initDataForCE])

  const handleSubmit = parameterForm.handleSubmit((data) => {
    const formData = _.omit(data, [
      ...constants.removalProperties,
      'multilingual_descriptions',
      'raw_parameter_type_id'
    ]) as any
    if (_.isEmpty(formData.order)) {
      formData.order = null
    } else {
      formData.order = parseInt(formData.order)
    }
    formData.parameter_type_id = parseInt(formData.parameter_type_id)
    if (dialogState.editMode) {
      dispatch(parameterStore.extraActions.update({ id: data.id, formData }))
    } else {
      dispatch(parameterStore.extraActions.create(formData))
    }
  })

  const handleClose = () => {
    dispatch(parameterStore.extraActions.closeDialog())
    setTab(0)
    parameterForm.clearErrors()
  }

  const handleChangeTab = (event, newTab: number) => {
    setTab(newTab)
  }

  const handleChangeHistoryLogs = (data: HistoryLog[]) => {
    dispatch(parameterStore.actions.setHistoryLogs(data))
  }

  return (
    <DialogMain
      open={dialogState.open}
      loading={dialogState.loading}
      height={dialogState.editMode ? 470 : 400}
      fullWidth
      maxWidth={initDataForCE.is_multilingual ? 'md' : 'sm'}
      title={dialogState.editMode ? t('form.title.update_parameter') : t('form.title.create_parameter')}
      onOk={handleSubmit}
      onClose={handleClose}
      okText={dialogState.editMode ? t('common:button.update') : t('common:button.create')}
      okButtonProps={{
        disabled: dialogState.loading || (!permissions?.edit && dialogState.editMode)
      }}
    >
      <Tabs value={tab} onChange={handleChangeTab}>
        <Tab label={t('common:tab.general')} />
        <Tab label={t('common:tab.history')} disabled={!dialogState.editMode} />
      </Tabs>
      <MalisPanel value={tab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={initDataForCE.is_multilingual ? 6 : 12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <AppTextField label="Type" name="type_id" value={paramTypeId} disabled required />
              </Grid>
              <Grid item xs={6}>
                <FormControllerTextField
                  control={parameterForm.control}
                  label="Code"
                  name="parameter_id"
                  value={224}
                  disabled={dialogState.editMode}
                  required
                />
              </Grid>
              <Grid item xs={8}>
                <FormControllerTextField control={parameterForm.control} label="Order" name="order" />
              </Grid>
              <Grid item xs={4}>
                <FormControllerCheckbox name="is_default" label="Default" control={parameterForm.control} />
              </Grid>
              <Grid item xs={12}>
                <FormControllerTextField label="Description" name="description" control={parameterForm.control} />
              </Grid>
              <Grid item xs={12}>
                <TableAttributes
                  attributes={initDataForCE.attributes}
                  control={parameterForm.control}
                  name="properties"
                  parameterId={initDataForCE.param_type_raw_id}
                  config={initDataForCE.param_type_specific_config}
                />
              </Grid>
            </Grid>
          </Grid>
          <When condition={initDataForCE.is_multilingual}>
            <Grid item xs={6}>
              <TableMultilingualDescription
                control={parameterForm.control}
                languageList={initParameter.PLLA}
                editMode={dialogState.editMode}
                editor="rte"
                name="descriptions"
                tableHeight={320}
              />
            </Grid>
          </When>
          <When condition={dialogState.editMode}>
            <Grid item xs={12} style={{ padding: 0, marginLeft: 4 }}>
              <SectionTimezone value={parameterDetail} />
            </Grid>
          </When>
        </Grid>
      </MalisPanel>
      <MalisPanel value={tab} index={1}>
        <AppTabHistoryLog
          isOpenDialog={dialogState.open}
          data={dialogState.historyLogs}
          onChange={handleChangeHistoryLogs}
          entityId={parameterDetail.id}
          mode={initDataForCE.is_multilingual ? 'horizonatal' : 'vertical'}
          tableHeight={initDataForCE.is_multilingual ? 390 : 250}
          descriptionRows={initDataForCE.is_multilingual ? 25 : 7}
          entity="parameter"
        />
      </MalisPanel>
    </DialogMain>
  )
}

export default CreateEditParameterCode
