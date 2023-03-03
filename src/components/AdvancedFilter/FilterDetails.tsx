import { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import useStyles from './styles'

import { Button, Tab, Tabs, Checkbox, FormControlLabel, Typography, Grid, Tooltip } from '@material-ui/core'

import {
  MalisPanel,
  DialogMain,
  useConfirm,
  confirmConstant,
  FormControllerTextField,
  EditIcon,
  SaveIcon,
  DeleteIcon,
  CloseIcon,
  FilterIcon,
  CopyIcon
} from '@/components'

import { When, Unless } from 'react-if'

import ConditionTree from './ConditionTree'
import SortConditionList from './SortConditionList'

import _ from 'lodash'
import { authStore, advancedFilterActions, commonStore } from '@/store/reducers'

export const conjunctions = [
  { description: 'AND', value: 'AND' },
  { description: 'OR', value: 'OR' }
]

function FilterDetails({ activeTab, onChangeActiveTab }) {
  // props.entity is the thing that you will pass to the backend to get the corresponding data for each module

  const classes = useStyles()
  const { confirm } = useConfirm()
  const { t } = useTranslation(['common', 'advanced_filter'])

  const dispatch = useDispatch()
  const columnOptions = useSelector(advancedFilterActions.selectColumn)
  const comparatorOptions = useSelector(advancedFilterActions.selectComparator)
  const sortOptions = useSelector(advancedFilterActions.selectSortOptions)
  const conditionTreeData = useSelector(advancedFilterActions.selectConditionTree)
  const sortConditions = useSelector(advancedFilterActions.selectSortConditions)
  const isUserDefault = useSelector(advancedFilterActions.selectUserDefault)
  const filterName = useSelector(advancedFilterActions.selectFilterDetailName)
  const isEditMode = useSelector(advancedFilterActions.selectEditMode)
  const filterDetail = useSelector(advancedFilterActions.selectFilterDetail)
  const permissions = useSelector(advancedFilterActions.selectPermissions)
  const loading = useSelector(advancedFilterActions.selectLoading)

  const afFormSelector = useSelector(advancedFilterActions.selectAfForm)
  const saveAsFormSelector = useSelector(advancedFilterActions.selectSaveAsForm)

  const userInfo = useSelector(authStore.selectProfile)

  const isSharedMode = filterDetail.created_by && filterDetail.created_by !== userInfo.user_name

  const conjunctionOptions = conjunctions

  const treeData = useMemo(() => _.cloneDeep(conditionTreeData), [conditionTreeData])
  const sortData = useMemo(() => _.cloneDeep(sortConditions), [sortConditions])

  const saveAsForm = useForm({
    defaultValues: { save_as_name: '' },
    shouldUnregister: false
  })
  const afForm = useForm({
    defaultValues: { name: '' },
    shouldUnregister: false
  })

  const formValidation = {
    name: {
      required: {
        value: true,
        message: t('advanced_filter:validations.name_required')
      },
      maxLength: {
        value: 80,
        message: t('advanced_filter:validations.name_max_length')
      }
    }
  }

  useEffect(() => {
    afForm.setValue('name', filterDetail.name)
    afForm.clearErrors()
  }, [filterDetail])

  useEffect(() => {
    if (afFormSelector.error) {
      afForm.setError('name', { message: afFormSelector.error })
    }
  }, [afFormSelector.error])

  useEffect(() => {
    if (saveAsFormSelector.error) {
      saveAsForm.setError('save_as_name', { message: saveAsFormSelector.error })
    }
  }, [saveAsFormSelector.error])

  useEffect(() => {
    if (saveAsFormSelector.clearError) {
      saveAsForm.clearErrors()
    }
  }, [saveAsFormSelector.clearError])

  useEffect(() => {
    if (afFormSelector.clearError) {
      afForm.clearErrors()
    }
  }, [afFormSelector.clearError])

  const onSubmitTreeData = afForm.handleSubmit((data) => {
    dispatch(
      advancedFilterActions.setFilterDetail({
        ...data,
        where_conditions: treeData,
        sort_conditions: sortData
      })
    )
    if (isEditMode) {
      dispatch(advancedFilterActions.update())
    } else {
      dispatch(advancedFilterActions.create())
    }
    afForm.clearErrors()
  })

  const onSetDefaultFilter = (_, checked: boolean) => {
    const nameTextBoxValue = afForm.getValues('name')
    dispatch(
      advancedFilterActions.setFilterDetail({
        name: nameTextBoxValue,
        is_user_default: checked
      })
    )
  }

  const onCloseAdvanceSearch = () => {
    dispatch(advancedFilterActions.resetState())
    dispatch(commonStore.actions.setTableState({ page: 1 }))
    dispatch(advancedFilterActions.close())
  }

  const onDeleteFilter = async () => {
    const title = t('advanced_filter:confirmation.title')
    const description = t('advanced_filter:confirmation.message_delete')
    const result = await confirm({ title, description })
    if (result === confirmConstant.actionTypes.OK) {
      dispatch(advancedFilterActions.remove())
    }
  }

  const onSaveAsSharedFilter = () => {
    dispatch(
      advancedFilterActions.setFilterDetail({
        is_shared: false,
        where_conditions: treeData,
        sort_conditions: sortData
      })
    )
    dispatch(advancedFilterActions.setSaveAsForm({ open: true }))
    const copyName = `Copy of ${filterName}`
    saveAsForm.setValue('save_as_name', copyName)
    if (copyName.length > formValidation.name.maxLength.value) {
      saveAsForm.setError('save_as_name', {
        type: 'manual',
        message: formValidation.name.maxLength.message
      })
    }
  }

  const onSubmitToSaveAs = saveAsForm.handleSubmit((data) => {
    dispatch(advancedFilterActions.saveAs(data.save_as_name))
  })

  const onCloseSaveAsForm = () => {
    saveAsForm.clearErrors()
    saveAsForm.reset()
    dispatch(advancedFilterActions.setSaveAsForm({ open: false }))
  }

  const onApplyAdvanceSearch = () => {
    const where_conditions = _.cloneDeep(treeData)
    const sort_conditions = _.cloneDeep(sortData)
    dispatch(
      advancedFilterActions.setDefaultFilter({
        where_conditions,
        sort_conditions
      })
    )
    dispatch(advancedFilterActions.apply())
  }

  const onUpdateSystemFilter = async () => {
    const title = t('advanced_filter:confirmation.title_warning')
    const description = t('advanced_filter:confirmation.description_warning')
    const result = await confirm({ title, description })
    if (result === confirmConstant.actionTypes.OK) {
      dispatch(
        advancedFilterActions.setFilterDetail({
          where_conditions: treeData,
          sort_conditions: sortData
        })
      )
      dispatch(advancedFilterActions.update())
    }
  }

  return (
    <>
      <Grid container alignItems="center" spacing={2} component="form" id="af-form">
        <Grid item xs={7}>
          <FormControllerTextField
            label={t('advanced_filter:filter_details.name_input')}
            variant="outlined"
            name="name"
            required
            disabled={isSharedMode}
            autoFocus={!isSharedMode}
            control={afForm.control}
            rules={formValidation.name}
          />
        </Grid>

        <Unless condition={filterDetail.is_system_default}>
          <Grid item xs={5} style={{ padding: 0 }}>
            <FormControlLabel
              disabled={false}
              control={
                <Checkbox
                  name="setAsDefault"
                  color="primary"
                  checked={isUserDefault}
                  onChange={onSetDefaultFilter}
                  className={classes.checkboxSetDefault}
                />
              }
              label={
                <Typography component="span" variant="body2">
                  {t('advanced_filter:filter_details.set_as_default')}
                </Typography>
              }
            />
          </Grid>
        </Unless>
      </Grid>
      <Tabs value={activeTab} onChange={onChangeActiveTab}>
        <Tab label={t('advanced_filter:filter_details.filter_tab')} />
        <Tab label={t('advanced_filter:filter_details.sort_tab')} />
      </Tabs>

      <MalisPanel value={activeTab} index={0} className={classes.tabPanel}>
        <ConditionTree
          columnOptions={columnOptions}
          comparatorOptions={comparatorOptions}
          conjunctionOptions={conjunctionOptions}
          data={treeData}
          maxLevel={2}
          disabled={false}
        />
      </MalisPanel>

      <MalisPanel value={activeTab} index={1} className={classes.tabPanel}>
        {/* <SortList /> */}
        <SortConditionList
          columnOptions={columnOptions}
          sortOptions={sortOptions}
          sortData={sortData}
          disabled={false}
        />
      </MalisPanel>
      <section className={classes.wrapButtonGroup}>
        <div className={classes.wrapButtonLeft}>
          <When condition={isSharedMode}>
            <Button variant="contained" onClick={onSaveAsSharedFilter} startIcon={<CopyIcon />}>
              {t('common:button.save_as')}
            </Button>
          </When>

          <When condition={filterDetail.is_system_default && permissions.update_system_default_presets}>
            <Tooltip title={t('advanced_filter:tooltip.update')}>
              <Button variant="contained" onClick={onUpdateSystemFilter} style={{ marginLeft: '5px' }}>
                {t('common:button.update')}
              </Button>
            </Tooltip>
          </When>

          <Unless condition={isSharedMode}>
            <Tooltip title={isEditMode ? t('advanced_filter:tooltip.update') : t('advanced_filter:tooltip.create')}>
              <Button
                variant="contained"
                type="submit"
                form="af-form"
                onClick={onSubmitTreeData}
                startIcon={isEditMode ? <EditIcon /> : <SaveIcon />}
              >
                {isEditMode ? t('common:button.update') : t('common:button.create')}
              </Button>
            </Tooltip>
          </Unless>

          <When condition={!isSharedMode && isEditMode}>
            <Button
              variant="contained"
              color="default"
              style={{ marginLeft: '5px' }}
              onClick={onDeleteFilter}
              startIcon={<DeleteIcon />}
            >
              {t('common:button.delete')}
            </Button>
          </When>
        </div>
        <div className={classes.wrapButtonRight}>
          <Tooltip title={t('advanced_filter:tooltip.apply')}>
            <Button variant="contained" onClick={onApplyAdvanceSearch} startIcon={<FilterIcon />}>
              {t('common:button.apply')}
            </Button>
          </Tooltip>
          <Tooltip title={t('advanced_filter:tooltip.close')}>
            <Button
              onClick={onCloseAdvanceSearch}
              startIcon={<CloseIcon />}
              variant="contained"
              style={{ marginLeft: 5 }}
            >
              {t('common:button.close')}
            </Button>
          </Tooltip>
        </div>
      </section>

      <DialogMain
        open={saveAsFormSelector.open}
        title={t('advanced_filter:confirmation.save_as_title')}
        maxWidth="sm"
        loading={loading.dialog}
        onOk={onSubmitToSaveAs}
        okText={t('common:button.save')}
        onClose={onCloseSaveAsForm}
        closeText={t('common:button.cancel')}
      >
        <FormControllerTextField
          style={{ marginTop: 8 }}
          name="save_as_name"
          label={t('advanced_filter:filter_details.name_input')}
          autoFocus
          required
          control={saveAsForm.control}
        />
      </DialogMain>
    </>
  )
}

export default FilterDetails
