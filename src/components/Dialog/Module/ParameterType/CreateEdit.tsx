import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'next-i18next'
import useStyles from './styles'

import * as yup from 'yup'
import * as constants from '@/utils/constant'
import _ from 'lodash'

import { Grid, Tooltip, Tabs, Tab } from '@material-ui/core'

import { When } from 'react-if'

import {
  FormControllerTextField,
  FormControllerAutocomplete,
  FormControllerCheckbox,
  DialogMain,
  AppTabHistoryLog,
  MalisPanel,
  SectionTimezone,
  BtnHelp
} from '@/components'

import { parameterTypeStore } from '@/store/reducers'

import type { ParameterTypeInstace } from '@/types/ParameterType'
import type { HistoryLog } from '@/types/Common'

function ParameterTypeAddEditDialog() {
  const classes = useStyles()
  const { t } = useTranslation('parameter_type')

  const [tab, setTab] = useState(0)

  const formValidationSchema = useMemo(
    () =>
      yup.object().shape({
        type_id: yup
          .string()
          .required(t('validation_message.type_id_required'))
          .max(8, t('validation_message.type_id_max'))
          .matches(constants.REGEX_ALPHA_NUMERIC_ONLY, t('validation_message.type_id_match')),
        description: yup.string().max(80, t('validation_message.description_max')),
        nbr_default: yup
          .string()
          .required(t('validation_message.nbr_default_required'))
          .matches(/^[0-9]+$/, t('validation_message.nbr_default_type_number')),
        attributes: yup
          .string()
          .matches(constants.REGEX_SEMICOLON_SEPERATED_ALPHA_NUMERIC_UNDERSCORE_ONLY, {
            message: t('validation_message.attributes_match'),
            excludeEmptyString: true
          })
          .test('uniq', t('validation_message.attributes_match'), (value) => {
            if (!value) {
              return true
            }
            const valueSplit = value.split(';')
            return _.uniq(valueSplit).length === valueSplit.length
          }),
        category: yup.number().required().nullable()
      }),
    [t]
  )

  const dispatch = useDispatch()
  const dialogState = useSelector(parameterTypeStore.selectDialogState)
  const editPermission = useSelector(parameterTypeStore.selectEditPermission)
  const { categories } = useSelector(parameterTypeStore.selectInitDataForCE)
  const paramTypeDetail = useSelector(parameterTypeStore.selectDetail)
  const { wiki_page } = useSelector(parameterTypeStore.selectInitDataForCE)

  const parameterTypeForm = useForm<ParameterTypeInstace>({
    resolver: yupResolver(formValidationSchema),
    shouldUnregister: false
  })

  useEffect(() => {
    parameterTypeForm.reset(paramTypeDetail)
    setTab(0)
  }, [paramTypeDetail])

  const onSubmit = parameterTypeForm.handleSubmit((formData) => {
    const data = _.omit(formData, [...constants.removalProperties, 'help', 'parameters'])
    data.nbr_default = parseInt((data as any).nbr_default)
    if (dialogState.editMode) {
      dispatch(
        parameterTypeStore.extraActions.update({
          id: formData.id,
          parameterType: data
        })
      )
    } else {
      dispatch(parameterTypeStore.extraActions.create(data))
    }
  })

  const onClose = () => {
    dispatch(parameterTypeStore.extraActions.closeDialog())
  }

  const handleChangeTab = (event, nextTab: number) => {
    setTab(nextTab)
  }

  const handleChangeHistoryLogs = (data: HistoryLog[]) => {
    dispatch(parameterTypeStore.actions.setHistoryLogs(data))
  }

  return (
    <>
      <DialogMain
        open={dialogState.open}
        loading={dialogState.loading}
        height={557}
        onOk={onSubmit}
        onClose={onClose}
        okText={dialogState.editMode ? t('common:button.update') : t('common:button.create')}
        okButtonProps={{
          disabled: dialogState.loading || (!editPermission && dialogState.editMode)
        }}
        title={
          <BtnHelp
            title={dialogState.editMode ? t('form.title.update_parameter_type') : t('form.title.create_parameter_type')}
            href={wiki_page}
          />
        }
      >
        <Tabs value={tab} onChange={handleChangeTab}>
          <Tab label={t('common:tab.general')} />
          <Tab label={t('common:tab.history')} disabled={!dialogState.editMode} />
        </Tabs>
        <MalisPanel value={tab} index={0}>
          <Grid container spacing={2} className={classes.wrapDialog}>
            <Grid item xs={8}>
              <FormControllerTextField
                autoFocus={!dialogState.editMode}
                control={parameterTypeForm.control}
                label="Type"
                name="type_id"
                required
                InputProps={{
                  readOnly: dialogState.editMode
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <FormControllerCheckbox
                control={parameterTypeForm.control}
                name="is_multilingual"
                disabled={dialogState.editMode}
                label="Multilingual"
              />
            </Grid>

            <Grid item xs={7}>
              <FormControllerAutocomplete
                name="category"
                control={parameterTypeForm.control}
                options={categories}
                disableClearable
                renderOption={(option) => option.description}
                label="Category"
                required
              />
            </Grid>

            <Grid item xs={5}>
              <FormControllerTextField
                control={parameterTypeForm.control}
                label="Number of defaults"
                name="nbr_default"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Tooltip
                title={
                  <>
                    <p>Must be a semicolon separated string of the attribute names. The attribute names themselves:</p>
                    <ul>
                      <li>Must contain only A-Z, a-z, 0-9 and underscore (_) character</li>
                      <li>Must not begin with a number </li>
                    </ul>
                  </>
                }
              >
                <FormControllerTextField label="Attributes" name="attributes" control={parameterTypeForm.control} />
              </Tooltip>
            </Grid>

            <Grid item xs={12}>
              <FormControllerTextField
                label="Description"
                name="description"
                control={parameterTypeForm.control}
                multiline
                rows={10}
              />
            </Grid>

            <When condition={dialogState.editMode}>
              <SectionTimezone value={paramTypeDetail} />
            </When>
          </Grid>
        </MalisPanel>
        <MalisPanel value={tab} index={1}>
          <AppTabHistoryLog
            isOpenDialog={dialogState.open}
            data={dialogState.historyLogs}
            onChange={handleChangeHistoryLogs}
            entityId={paramTypeDetail?.id}
            entity="parameter_type"
          />
        </MalisPanel>
      </DialogMain>
    </>
  )
}

export default ParameterTypeAddEditDialog
