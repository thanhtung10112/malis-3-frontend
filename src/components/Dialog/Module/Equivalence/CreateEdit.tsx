import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import useStyles from './styles'

import { Grid, Button, Paper, Tooltip, Checkbox, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Backup as BackupIcon, HighlightOffOutlined as HighlightOffOutlinedIcon } from '@material-ui/icons'
import {
  DataTable,
  FormControllerTextField,
  DataTableTextField,
  SectionTimezone,
  DialogMain,
  CreateIcon,
  DeleteIcon,
  DataTableAutocomplete,
  AppAutocomplete,
  AppImageField,
  BtnHelp,
  FormControllerNumberField
} from '@/components'
import { Unless, When } from 'react-if'

import immer from 'immer'
import _ from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup'
import * as columnProperties from '@/utils/columnProperties'
import getValidationSchema from './validationSchema'
import { removalProperties } from '@/utils/constant'
import { equivalenceStore } from '@/store/reducers'

import type { EquivalenceDetail } from '@/types/Equivalence'
import type { ParameterOption } from '@/types/Common'

function StandardEquivalenceCreateEdit() {
  const { t } = useTranslation('equivalence')

  const validationSchema = useMemo(() => getValidationSchema(t), [])
  const equivalenceForm = useForm<EquivalenceDetail>({
    shouldUnregister: false,
    resolver: yupResolver(validationSchema)
  })
  const watchEquivalentStandards = equivalenceForm.watch('standards', [])
  const watchImage = equivalenceForm.watch('image', '')

  let refFileInput: HTMLInputElement = null
  const setInputELement = (element: HTMLInputElement) => {
    refFileInput = element
  }

  const [selectedRows, setSelectedRows] = useState([])
  const [idUploadImage, setIdUploadImage] = useState('')
  const [selectedStandards, setSelectedStandards] = useState([])

  const dispatch = useDispatch()
  const dialogState = useSelector(equivalenceStore.selectDialogState)
  const equivalenceType = useSelector(equivalenceStore.selectEquivalenceType)
  const equivalenceDetail = useSelector(equivalenceStore.selectDetail)
  const { parameters, wiki_page } = useSelector(equivalenceStore.selectInitDataForCE)
  const permissions = useSelector(equivalenceStore.selectPermissions)

  const isCreating = _.isNil(equivalenceDetail.id)

  const classes = useStyles({ editMode: !isCreating })
  const standardErrorMessage = useMemo(() => {
    const { errors } = equivalenceForm
    if (!errors.standards) {
      return ''
    }
    errors.standards = errors.standards.filter((err) => err)
    return _.get(errors, 'standards[0].organization.message') || _.get(errors, 'standards[0].standard.message')
  }, [equivalenceForm.errors.standards])

  const title = useMemo(() => {
    const action = isCreating ? 'Create' : 'Update'
    const type =
      equivalenceType === 'manufacturing_standard'
        ? 'Manufacturing Standards Equivalence'
        : 'Material Standards Equivalence'
    return `${action} ${type}`
  }, [isCreating, equivalenceType])

  useEffect(() => {
    equivalenceForm.reset({ ...equivalenceDetail })
  }, [equivalenceDetail])

  const onCloseDialog = () => {
    dispatch(equivalenceStore.sagaCloseDialog())
    equivalenceForm.clearErrors()
  }

  const getStandard = (value: number) => {
    const option = _.find(parameters.PLNO, { value })
    return option
  }

  const onSelectStandard = (event, valueOptions) => {
    setSelectedStandards(valueOptions)
  }

  const onAddEquivalentStandards = () => {
    const standards = _.map(selectedStandards, (item) => ({
      organization: item.value,
      standard: '',
      preferred: false,
      image: null
    }))
    equivalenceForm.setValue('standards', [...watchEquivalentStandards, ...standards])
    setSelectedStandards([])
  }
  const onSelectRows = ({ selectionModel }) => {
    setSelectedRows(selectionModel)
  }

  const onRemoveEquivalentStandards = () => {
    const removalItems = _.filter(watchEquivalentStandards, (item) => !selectedRows.includes(item.organization))
    equivalenceForm.setValue('standards', removalItems)
    setSelectedRows([])
  }

  const onChangePreferred = (organization) => (event, checked) => {
    const newStandards = immer(watchEquivalentStandards, (draft) => {
      const index = _.findIndex(watchEquivalentStandards, { organization })
      draft[index].preferred = checked
    })
    equivalenceForm.setValue('standards', newStandards)
  }

  const onChangeStandard = async (organization, value) => {
    const newStandards = immer(watchEquivalentStandards, (draft) => {
      const index = _.findIndex(watchEquivalentStandards, { organization })
      draft[index].standard = value
    })
    equivalenceForm.setValue('standards', newStandards)
    equivalenceForm.errors.standards && (await equivalenceForm.trigger('standards'))
  }

  const onChangeOrganization = (id) => async (event, organization) => {
    const newStandards = immer(watchEquivalentStandards, (draft) => {
      const index = _.findIndex(draft, { organization: id })
      if (index !== -1) {
        draft[index].organization = organization.value
      }
    })
    equivalenceForm.setValue('standards', newStandards)
  }

  const onChangeFiles = (event) => {
    const { files } = event.target
    equivalenceForm.setValue(
      'standards',
      immer(watchEquivalentStandards, (draft) => {
        const index = _.findIndex(watchEquivalentStandards, {
          id: idUploadImage
        })
        draft[index].image = files[0]
      })
    )
  }

  const filterOrganizationOption = (options: ParameterOption[]) =>
    _.differenceWith(options, watchEquivalentStandards, (option, standard) => option.value === standard.organization)

  const onClickToUploadImage = (id) => () => {
    setIdUploadImage(id)
    refFileInput.value = ''
    refFileInput.click()
  }

  const onRemoveImage = (id) => (event) => {
    event.stopPropagation()
    equivalenceForm.setValue(
      'standards',
      immer(watchEquivalentStandards, (draft) => {
        const index = _.findIndex(watchEquivalentStandards, { id })
        draft[index].image = ''
      })
    )
  }

  const onSubmitForm = equivalenceForm.handleSubmit((data) => {
    data.equiv_type = equivalenceType === 'manufacturing_standard' ? 1 : 0
    const payload = _.omit(data, [...removalProperties])
    const formData = new FormData()
    if (payload.image && payload.image instanceof File) {
      formData.append('equiv_image', payload.image)
    }
    delete payload.image
    const std_for_remove_img = []
    for (const std of payload.standards) {
      if (std.image && std.image instanceof File) {
        formData.append(`std_${std.organization}`, std.image)
      } else {
        // formData.append(`std_${std.organization}`, null as File)
        std_for_remove_img.push(std.organization)
      }
      delete std.image
    }
    formData.append(
      'equiv_info',
      JSON.stringify({
        ...payload,
        standards_for_remove_img: std_for_remove_img
      })
    )
    if (isCreating) {
      dispatch(equivalenceStore.sagaCreate(formData))
    } else {
      dispatch(
        equivalenceStore.sagaUpdate({
          id: data.id,
          formData
        })
      )
    }
  })

  const onGetNextCode = () => {
    const currentValues = equivalenceForm.getValues()
    dispatch(equivalenceStore.sagaGetNextCode(currentValues))
  }

  const handleChangeImage = async (image) => {
    equivalenceForm.setValue('image', image.file)
    await equivalenceForm.trigger('image')
  }

  return (
    <DialogMain
      open={dialogState.open}
      maxWidth="md"
      loading={dialogState.loading}
      onOk={onSubmitForm}
      onClose={onCloseDialog}
      title={<BtnHelp title={title} href={wiki_page} />}
      height={isCreating ? 500 : 540}
      classes={{ paperWidthMd: classes.paperRoot }}
      okText={isCreating ? t('common:button.create') : t('common:button.update')}
      okButtonProps={{
        disabled: dialogState.loading || (!permissions?.edit && !isCreating)
      }}
    >
      <Grid container spacing={2} className={classes.gridMarginTop}>
        <When condition={Boolean(equivalenceForm.errors?.standards)}>
          <Grid item xs={12}>
            <Alert severity="error">{standardErrorMessage}</Alert>
          </Grid>
        </When>

        <Grid item xs={9} spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} spacing={3}>
              <FormControllerNumberField
                label="Equivalence #"
                name="equiv_id"
                control={equivalenceForm.control}
                required
                decimalScale={0}
                fixedDecimalScale={false}
                generateCode
                disabled={!isCreating}
                loading={dialogState.loading}
                onGenerateCode={onGetNextCode}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControllerTextField
                required
                label="Description"
                name="description"
                control={equivalenceForm.control}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={3} style={{ height: 88 }}>
          <AppImageField
            image={watchImage as string}
            onChange={handleChangeImage}
            error={equivalenceForm.errors.image?.message || ''}
          />
        </Grid>

        <Grid item xs={9}>
          <AppAutocomplete
            label="Equivalent standards per organization"
            value={selectedStandards}
            multiple
            limitTags={2}
            disableCloseOnSelect
            options={parameters.PLNO}
            renderOption={(option) => option.description}
            filterOptions={filterOrganizationOption}
            onChange={onSelectStandard}
          />
        </Grid>

        <Grid item xs={3}>
          <Button
            startIcon={<CreateIcon />}
            onClick={onAddEquivalentStandards}
            disabled={selectedStandards.length === 0}
            style={{ textTransform: 'capitalize' }}
          >
            Add
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={onRemoveEquivalentStandards}
            disabled={selectedRows.length <= 0}
            style={{ textTransform: 'capitalize' }}
          >
            Remove
          </Button>
        </Grid>

        <input
          type="file"
          onChange={onChangeFiles}
          ref={setInputELement}
          className={classes.input}
          accept={['image/png', 'image/jpg', 'image/jpeg'].join(',')}
        />

        <Grid item xs={12}>
          <Paper>
            <DataTable
              tableHeight={equivalenceForm.errors?.standards ? 263 : 335}
              hideFooter
              checkboxSelection
              disableColumnMenu
              disableSelectionOnClick
              rows={watchEquivalentStandards}
              selectionModel={selectedRows}
              getRowId={(param) => param.organization}
              onSelectionModelChange={onSelectRows}
              columns={[
                {
                  // ...columnProperties.defaultProperties,
                  ...columnProperties.editCell('Organization'),
                  sortable: false,
                  field: 'organization',
                  headerName: 'Organization',
                  flex: 0.5,
                  valueGetter(params) {
                    const value = getStandard(params.value as number)
                    return value
                  },
                  valueFormatter(params: any) {
                    return params.value?.description
                  },
                  renderEditCell(params) {
                    return (
                      <DataTableAutocomplete
                        params={params}
                        options={parameters.PLNO}
                        onChange={onChangeOrganization(params.id)}
                        filterOptions={filterOrganizationOption}
                      />
                    )
                  }
                },
                {
                  ...columnProperties.defaultProperties,
                  ...columnProperties.editCell('Standard'),
                  field: 'standard',
                  flex: 0.4,
                  renderEditCell(params) {
                    return <DataTableTextField params={params} onChangeValue={onChangeStandard} />
                  }
                },
                {
                  ...columnProperties.defaultProperties,
                  field: 'preferred',
                  headerName: 'Preferred',
                  width: 100,
                  align: 'center',
                  headerAlign: 'center',
                  renderCell(params) {
                    return (
                      <Checkbox
                        color="primary"
                        style={{ padding: 0 }}
                        checked={params.value as boolean}
                        onChange={onChangePreferred(params.id)}
                      />
                    )
                  }
                },
                {
                  field: 'image',
                  headerName: 'Image',
                  sortable: false,
                  width: 150,
                  align: 'center',
                  headerAlign: 'center',
                  renderCell(params) {
                    if (params.value) {
                      return (
                        <Tooltip
                          title={
                            <img
                              src={
                                params.value instanceof File ? URL.createObjectURL(params.value) : (params.value as any)
                              }
                              style={{ height: '150px' }}
                            />
                          }
                          placement="top-end"
                        >
                          <div style={{ display: 'flex' }} onClick={onClickToUploadImage(params.id)}>
                            <Typography noWrap component="div" style={{ width: 100 }}>
                              {(params.value as any).name || params.value}
                            </Typography>
                            <HighlightOffOutlinedIcon onClick={onRemoveImage(params.id)} />
                          </div>
                        </Tooltip>
                      )
                    }
                    return (
                      <Tooltip title="Only PNG, JPG, JPEG files are allowed!">
                        <div
                          style={{ display: 'flex', alignItems: 'center' }}
                          onClick={onClickToUploadImage(params.id)}
                        >
                          <BackupIcon style={{ color: '#0A65FF' }} />
                        </div>
                      </Tooltip>
                    )
                  }
                }
              ]}
            />
          </Paper>

          <Unless condition={isCreating}>
            <SectionTimezone value={equivalenceDetail} />
          </Unless>
        </Grid>
      </Grid>
    </DialogMain>
  )
}

export default StandardEquivalenceCreateEdit
