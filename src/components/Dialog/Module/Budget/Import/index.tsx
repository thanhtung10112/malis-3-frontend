import React from 'react'
import { Grid, TextField, Typography } from '@material-ui/core'

import { DialogMain, FormControllerAutocomplete, FormControllerRadio, DialogSSEProcess } from '@/components'

import useStyles from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'

import FileSaver from 'file-saver'
import { yupResolver } from '@hookform/resolvers/yup'
import _ from 'lodash'

import { budgetActions } from '@/store/reducers'
import getValidationSchema from './validationSchema'
import { ExtraButton } from '@/components/Dialog/Main/type'

function BudgetAddEditDialog() {
  const classes = useStyles()
  const { t } = useTranslation('budget')
  const refInputFile = React.useRef<any>({})
  const validationSchema = React.useMemo(() => getValidationSchema(t), [])

  const fileTypeOptions = React.useMemo(
    () => [
      { id: 0, description: t('form.label.file_type_text') },
      { id: 1, description: t('form.label.file_type_excel') }
    ],
    []
  )

  const budgetForm = useForm({
    shouldUnregister: false,
    resolver: yupResolver(validationSchema),
    defaultValues: {
      file_type: 1,
      mode: 0,
      importFile: null
    }
  })

  const watchFileType = budgetForm.watch('file_type', 0)

  const dispatch = useDispatch()
  const importDialogState = useSelector(budgetActions.selectImportDialogState)
  const resultImportState = useSelector(budgetActions.selectImportResultDialog)
  const userJob = useSelector(budgetActions.selectUserJob)
  const importProcess = useSelector(budgetActions.selectImportDialogProcess)

  React.useEffect(() => {
    if (!_.isNil(refInputFile.current)) {
      refInputFile.current.value = ''
    }
    budgetForm.setValue('importFile', null)
  }, [watchFileType])

  const onClose = () => {
    dispatch(budgetActions.setImportOpen(false))
    budgetForm.reset()
  }

  const handleUploadFile = async (event) => {
    const { files } = event.target
    budgetForm.setValue('importFile', files[0])
    await budgetForm.trigger('importFile')
  }

  const handleSuccess = (operationId, data) => {
    dispatch(budgetActions.setImportOpen(false))
    dispatch(
      budgetActions.setImportResult({
        result: data.operation_result.report,
        success: data.operation_result.success,
        isOpen: true
      })
    )
  }

  const createOperationData = (data) => {
    const operationData = {
      job_id_pk: userJob.value,
      file_type: data.file_type === 0 ? 'text' : 'excel',
      mode: data.mode === 0 ? 'test' : 'write'
    } as any
    return operationData
  }

  const onImportWriteMode = () => {
    const data = budgetForm.getValues()
    data.mode = 1
    const operationData = createOperationData(data)
    dispatch(
      budgetActions.importCostCode({
        operationData,
        file: data.importFile,
        mode: data.mode
      })
    )
  }

  const onSendReportMail = () => {
    const data = budgetForm.getValues()
    const importInfo = {
      title: t('form.title.report'),
      content: resultImportState.result
    }

    const formData = new FormData()
    formData.append('import', data.importFile)
    formData.append('import_info', JSON.stringify(importInfo))

    dispatch(budgetActions.sendReportMail(formData))
  }

  const onSubmitForm = budgetForm.handleSubmit((data) => {
    const operationData = {
      job_id_pk: userJob.value,
      file_type: data.file_type === 0 ? 'text' : 'excel',
      mode: data.mode === 0 ? 'test' : 'write'
    } as any
    dispatch(
      budgetActions.importCostCode({
        operationData,
        file: data.importFile,
        mode: data.mode
      })
    )
  })

  const onCloseImportResult = () => {
    dispatch(budgetActions.setImportResult({ isOpen: false }))
    dispatch(budgetActions.getList())
    onClose()
  }

  const onDownloadImportResult = () => {
    const { result } = resultImportState
    const fileText = new Blob([result], { type: 'text/plain;charset=utf-8' })
    FileSaver.saveAs(fileText, 'result_import_cost_codes.txt')
  }

  const renderExtraButtons = () => {
    const extraButtons: ExtraButton[] = [
      {
        label: t('button.import_write_mode'),
        onClick: onImportWriteMode,
        hide: importDialogState.mode === 1 || !resultImportState.success // if mode = write or result import = failed
      },
      {
        label: t('button.report'),
        onClick: onSendReportMail
        // disabled: true
      },
      {
        label: t('button.download'),
        onClick: onDownloadImportResult
      },
      {
        label: t('common:button.close'),
        onClick: onCloseImportResult
      }
    ]
    return extraButtons
  }

  const handleCloseImportProcess = () => {
    dispatch(budgetActions.setOpenImportProcess(false))
  }

  const handleOpenRemindData = () => {
    dispatch(budgetActions.getRemindData())
  }

  return (
    <>
      <DialogMain
        open={importDialogState.isOpen}
        title={t('form.title.import')}
        loading={importDialogState.isLoading}
        okText={t('button.import')}
        onOk={onSubmitForm}
        onClose={onClose}
      >
        <Grid container spacing={3} className={classes.wrapDialog}>
          <Grid item xs={12}>
            <Typography display="block" variant="body2">
              {t('import_description')}
              <span className={classes.moreInfo} onClick={handleOpenRemindData}>
                <u>{t('import_description_learn_more')}</u>
              </span>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControllerAutocomplete
              name="file_type"
              label={t('form.label.file_type')}
              required
              options={fileTypeOptions}
              control={budgetForm.control}
              disableClearable
              renderOption={(option) => option.description}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={budgetForm.errors?.importFile}
              helperText={budgetForm.errors?.importFile?.message}
              inputRef={refInputFile}
              type="file"
              required
              onChange={handleUploadFile}
              inputProps={{
                style: { height: 23 },
                accept:
                  watchFileType === 0
                    ? 'text/plain'
                    : [
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                      ].join(',')
              }}
            />
          </Grid>

          <Grid item xs={12} style={{ paddingTop: 0 }}>
            <FormControllerRadio
              label={t('form.label.mode')}
              name="mode"
              control={budgetForm.control}
              options={[
                { label: t('form.label.mode_test'), value: 0 },
                { label: t('form.label.mode_write'), value: 1 }
              ]}
            />
          </Grid>
        </Grid>
      </DialogMain>
      <DialogMain
        open={resultImportState.isOpen}
        title={resultImportState.success ? 'Completed' : 'Failed'}
        type={resultImportState.success ? 'success' : 'error'}
        fullWidth
        maxWidth="sm"
        loading={importDialogState.isLoading}
        extraButtons={renderExtraButtons()}
      >
        <TextField value={resultImportState.result} multiline rows={20} style={{ marginTop: 12 }} />
      </DialogMain>
      <DialogSSEProcess
        open={importProcess.openDialogProcess}
        operationId={importProcess.operation_id}
        onClose={handleCloseImportProcess}
        onSuccess={handleSuccess}
      />
    </>
  )
}

export default BudgetAddEditDialog
