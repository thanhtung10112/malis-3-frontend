import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, FormProvider } from 'react-hook-form'
import { useTranslation } from 'next-i18next'

import { DialogContent, Grid, Typography, Button, Tab, Tabs, Tooltip, Paper } from '@material-ui/core'

import {
  DialogMain,
  MalisPanel,
  SortConditionList,
  ConditionTree,
  ColumnList,
  ExportProgressDialog,
  useConfirm,
  AppTitle,
  DialogSaveAsPreset,
  ExcelIcon,
  confirmConstant
} from '@/components/index'

import { When, If, Then, Else } from 'react-if'

import FileCopyIcon from '@material-ui/icons/FileCopy'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import ListAltIcon from '@material-ui/icons/ListAlt'
import DeleteIcon from '@material-ui/icons/Delete'
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf'
import CloseIcon from '@material-ui/icons/Close'

import TablePresetList from './TablePresetList'
import TabOptions from './TabOptions'
import SectionGeneralInfo from './SectionGeneralInfo'

import useStyles from './styles'
import useStylesLayout from '@/styles/page/layout'

import { authStore, makeAListActions } from '@/store/reducers'

import _ from 'lodash'
import clsx from 'clsx'
import getValidationSchema from './validationSchema'

export default function MakeAListDialog() {
  const { t } = useTranslation('make_a_list')
  const classes = useStyles()
  const classesLayout = useStylesLayout()

  const { confirm } = useConfirm()

  const [activeTab, setActiveTab] = useState(0)
  const [disabledActions, setDisableActions] = useState(false)

  const dispatch = useDispatch()

  const isEditMode = useSelector(makeAListActions.selectIsEditMode)
  const isOpen = useSelector(makeAListActions.selectIsOpen)

  const presetDetail = useSelector(makeAListActions.selectPresetDetail)
  const columnsDisplayed = useSelector(makeAListActions.selectColumnDisplay)
  const whereConditions = useSelector(makeAListActions.selectWhereConditions)
  const sortConditions = useSelector(makeAListActions.selectSortConditions)

  const columnOptions = useSelector(makeAListActions.selectColumnsData)
  const comparatorOptions = useSelector(makeAListActions.selectComparatorsData)
  const conjunctionOptions = useSelector(makeAListActions.selectLogicalOperatorsData)
  const sortOptions = useSelector(makeAListActions.selectSortOptionsData)

  const permissions = useSelector(makeAListActions.selectPermissions)

  const saveAsFormSelector = useSelector(makeAListActions.selectSaveAsForm)
  const malFormSelector = useSelector(makeAListActions.selectMalForm)

  const loadingDialog = useSelector(makeAListActions.selectLoadingDialog)

  const userInfo = useSelector(authStore.selectProfile)

  const columnsDisplayedData = useMemo(() => _.cloneDeep(columnsDisplayed), [columnsDisplayed])
  const sortConditionsData = useMemo(() => _.cloneDeep(sortConditions), [sortConditions])
  const whereConditionsData = useMemo(() => _.cloneDeep(whereConditions), [whereConditions])

  const isSharedMode = presetDetail.created_by && presetDetail.created_by !== userInfo.user_name

  const saveAsForm = useForm({
    defaultValues: { save_as_name: '' },
    shouldUnregister: false
  })
  const validationSchema = useMemo(() => getValidationSchema(t), [])

  const makeAListForm = useForm({
    defaultValues: makeAListActions.presetDetail,
    shouldUnregister: false
  })

  useEffect(() => {
    makeAListForm.reset({
      ...presetDetail
    })
  }, [presetDetail])

  // handle error for the SaveAs form
  useEffect(() => {
    if (saveAsFormSelector.error) {
      saveAsForm.setError('save_as_name', { message: saveAsFormSelector.error })
    }
  }, [saveAsFormSelector.error])

  // clear error in SaveAs form if clone successfully!
  useEffect(() => {
    if (saveAsFormSelector.clearError) {
      saveAsForm.clearErrors()
    }
  }, [saveAsFormSelector.clearError])

  // handle error for the Mal form
  useEffect(() => {
    if (malFormSelector.error) {
      makeAListForm.setError('name', { message: malFormSelector.error })
    }
  }, [malFormSelector.error])

  // handle error in Mal form if clone successfully!
  useEffect(() => {
    if (malFormSelector.clearError) {
      makeAListForm.clearErrors()
    }
  }, [malFormSelector.clearError])

  useEffect(() => {
    const isDisabled = columnsDisplayed.length <= 0
    setDisableActions(isDisabled)
  }, [columnsDisplayed])

  useEffect(() => {
    return () => {
      dispatch(makeAListActions.resetState())
    }
  }, [])

  useEffect(() => {
    dispatch(makeAListActions.setIsEditMode(true))
  }, [])

  const handleChange = (_, tabIndex) => {
    setActiveTab(tabIndex)
  }

  const handleClose = () => {
    dispatch(makeAListActions.setOpen(false))
    dispatch(makeAListActions.setFilterType('own'))
    // dispatch(makeAListActions.resetState())
    makeAListForm.clearErrors()
  }

  const handleExport = (destination) => () => {
    dispatch(
      makeAListActions.exportMakeAList({
        destination: destination,
        displayedColumns: columnsDisplayedData,
        sortConditions: sortConditionsData,
        whereCondtions: whereConditionsData,
        distinct: presetDetail.distinct,
        ignoreCase: presetDetail.ignore_case
      })
    )
  }

  const onSubmitData = makeAListForm.handleSubmit((data) => {
    data.columns_displayed = columnsDisplayedData
    data.sort_conditions = sortConditionsData
    data.where_conditions = whereConditionsData
    if (isEditMode) {
      dispatch(makeAListActions.update(data))
    } else {
      dispatch(makeAListActions.create(data))
    }
  })

  const onSaveSharedPreset = () => {
    const { name } = makeAListForm.getValues()
    const copyName = `Copy of ${name}`
    saveAsForm.setValue('save_as_name', copyName, {
      shouldValidate: true,
      shouldDirty: true
    })
    dispatch(makeAListActions.setSaveAsForm({ open: true }))
  }

  const onSubmitSaveAsForm = saveAsForm.handleSubmit((data) => {
    const values = makeAListForm.getValues()
    const payload = {
      ...values,
      name: data.save_as_name,
      is_shared: false,
      columns_displayed: columnsDisplayedData,
      sort_conditions: sortConditionsData,
      where_conditions: whereConditionsData
    }
    dispatch(makeAListActions.saveAs(payload))
  })

  const onCloseSaveAsForm = () => {
    dispatch(makeAListActions.setSaveAsForm({ open: false }))
    saveAsForm.clearErrors()
    saveAsForm.reset()
  }

  const onUpdateSystemPreset = async () => {
    const result = await confirm({
      title: t('common:label.warning'),
      description: t('message.update_system_preset_warning')
    })
    if (result === confirmConstant.actionTypes.OK) {
      const data = makeAListForm.getValues()
      data.where_conditions = whereConditionsData
      data.columns_displayed = columnsDisplayedData
      data.sort_conditions = sortConditionsData
      dispatch(makeAListActions.update(data))
    }
  }

  const onDeletePreset = async () => {
    const result = await confirm({
      title: t('common:label.confirmation'),
      description: t('message.confirm_delete_preset')
    })
    if (result === confirmConstant.actionTypes.OK) {
      dispatch(makeAListActions.remove())
    }
  }

  const watchColumnChange = () => {
    const isDisabled = columnsDisplayedData.length <= 0
    setDisableActions(isDisabled)
  }

  return (
    <>
      <DialogMain
        open={isOpen}
        fullWidth
        maxWidth="lg"
        onClose={handleClose}
        hideButtonsAction
        title={
          <Typography variant="h5" component="h4" className={classes.title}>
            {t('make_a_list')}
          </Typography>
        }
      >
        <FormProvider {...makeAListForm}>
          <DialogContent className={classes.dialogContent}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TablePresetList setActiveTab={setActiveTab} />
              </Grid>

              {/* Preset detail */}
              <Grid item xs={8}>
                <Paper className={classes.sectionCriteria}>
                  <Tabs value={activeTab} onChange={handleChange} style={{ padding: '5px' }}>
                    <Tab label="Columns" />
                    <Tab label="Select on" />
                    <Tab label="Sort on" />
                    <Tab label="Options" />
                  </Tabs>

                  <MalisPanel value={activeTab} index={0} className={classes.tabPanel}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('label.choose_column_displayed')}
                    </Typography>
                    <ColumnList
                      columnOptions={columnOptions}
                      selectedColumns={columnsDisplayedData}
                      disabled={false}
                      onRemove={watchColumnChange}
                      onAdd={watchColumnChange}
                    />
                  </MalisPanel>

                  <MalisPanel value={activeTab} index={1} className={classes.tabPanel}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('label.select_criteria')}
                    </Typography>
                    <ConditionTree
                      columnOptions={columnOptions}
                      comparatorOptions={comparatorOptions}
                      conjunctionOptions={conjunctionOptions}
                      data={whereConditionsData}
                      maxLevel={0}
                      disabled={false}
                    />
                  </MalisPanel>

                  <MalisPanel value={activeTab} index={2} className={classes.tabPanel}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('label.select_sorting')}
                    </Typography>
                    <SortConditionList
                      columnOptions={columnOptions}
                      sortOptions={sortOptions}
                      sortData={sortConditionsData}
                      disabled={false}
                    />
                  </MalisPanel>

                  <MalisPanel value={activeTab} index={3} className={classes.tabPanel}>
                    <TabOptions />
                  </MalisPanel>
                </Paper>
                <Paper className={classes.sectionGeneralInfor}>
                  <AppTitle label="General information" />
                  <Grid spacing={2} container component="form" id="make-a-list-form" onSubmit={onSubmitData}>
                    <SectionGeneralInfo isSharedMode={isSharedMode} />
                  </Grid>
                </Paper>

                <div className={classes.wrapButtonGroup}>
                  <div className="wrapButtonLeft">
                    <If condition={isSharedMode}>
                      <Then>
                        <Button
                          className={clsx(classesLayout.buttonControl, classes.buttonAction)}
                          variant="contained"
                          onClick={onSaveSharedPreset}
                          startIcon={<FileCopyIcon />}
                        >
                          {t('common:button.save_as')}
                        </Button>
                      </Then>
                      <Else>
                        <Button
                          className={clsx(classesLayout.buttonControl, classes.buttonAction)}
                          variant="contained"
                          form="make-a-list-form"
                          type="submit"
                          startIcon={isEditMode ? <EditIcon /> : <SaveIcon />}
                        >
                          {isEditMode ? t('common:button.update') : t('make_a_list:button.save')}
                        </Button>
                      </Else>
                    </If>

                    <When condition={!isSharedMode && isEditMode}>
                      <Button
                        variant="contained"
                        className={clsx(classesLayout.buttonControl, classes.buttonAction)}
                        onClick={onDeletePreset}
                        startIcon={<DeleteIcon />}
                      >
                        {t('common:button.delete')}
                      </Button>
                    </When>

                    <When condition={presetDetail.is_system_default && permissions.update_system_default_presets}>
                      <Button
                        className={clsx(classesLayout.buttonControl, classes.buttonAction)}
                        variant="contained"
                        onClick={onUpdateSystemPreset}
                        startIcon={<EditIcon />}
                      >
                        {t('common:button.update')}
                      </Button>
                    </When>
                  </div>
                  <div className="wrapButtonRight">
                    <Button
                      className={clsx(classesLayout.buttonControl, classes.buttonAction)}
                      variant="contained"
                      onClick={handleExport('screen')}
                      disabled={disabledActions}
                      startIcon={<ListAltIcon />}
                    >
                      {t('common:button.export_to_screen')}
                    </Button>
                    <Button
                      className={clsx(classesLayout.buttonControl, classes.buttonAction)}
                      variant="contained"
                      onClick={handleExport('pdf')}
                      disabled={disabledActions}
                      startIcon={<PictureAsPdfIcon />}
                    >
                      {t('common:button.export_to_pdf')}
                    </Button>
                    <Button
                      className={clsx(classesLayout.buttonControl, classes.buttonAction)}
                      variant="contained"
                      onClick={handleExport('excel')}
                      disabled={disabledActions}
                      startIcon={<ExcelIcon />}
                    >
                      {t('common:button.export_to_excel')}
                    </Button>
                    <Tooltip title={t('make_a_list:tooltip.close')}>
                      <Button
                        variant="contained"
                        onClick={handleClose}
                        className={clsx(classesLayout.buttonControl, classes.buttonAction)}
                        startIcon={<CloseIcon />}
                      >
                        {t('common:button.close')}
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
        </FormProvider>
      </DialogMain>

      <DialogSaveAsPreset
        open={saveAsFormSelector.open}
        loading={loadingDialog}
        control={saveAsForm.control}
        onClose={onCloseSaveAsForm}
        onSubmit={onSubmitSaveAsForm}
        rules={validationSchema.name}
      />

      <ExportProgressDialog />
    </>
  )
}
