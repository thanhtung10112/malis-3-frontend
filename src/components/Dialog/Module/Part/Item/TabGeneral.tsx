import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'next-i18next'

import { Button, Grid } from '@material-ui/core'
import { When } from 'react-if'
import {
  FormControllerTextField,
  TableMultilingualDescription,
  FormControllerAutocomplete,
  AppAutocompleteAsync,
  SectionTimezone,
  AppAutocomplete,
  CopyIcon,
  DropdownIcon,
  FormControllerNumberField,
  useConfirm
} from '@/components'
import DialogCopyItem from './DialogCopyItem'

import itemApi from '@/apis/item.api'
import partApi from '@/apis/part.api'
import { commonStore, partStore } from '@/store/reducers'
import _ from 'lodash'
import { itemMassFormat } from '@/utils/constant'
import { StatusCode } from '@/utils/StatusCode'

import type { ItemDetail } from '@/types/Item'
import type { DataForDropdown } from '@/types/Common'
import type { AutocompleteChangeReason } from '@material-ui/lab'

const TabGeneral: React.FC = () => {
  const { t } = useTranslation('common')
  const { confirm } = useConfirm()

  const [openCopyItem, setOpenCopyItem] = useState(false)
  const [defaultPartList, setDefaultPartList] = useState([])

  const itemForm = useFormContext<ItemDetail>()
  const itemFormData = itemForm.getValues()
  const watchDrawingId = itemForm.watch('drawing_id', null)
  const watchRefTo = itemForm.watch('reference_to', null)
  const watchId = itemForm.watch('id', null)

  const isCreating = _.isNil(watchId)

  const dispatch = useDispatch()
  const parameters = useSelector(partStore.selectParameters)
  const userJob = useSelector(commonStore.selectUserValueJob)
  const entity = useSelector(commonStore.selectEntity)

  const getAdditionalDataPart = () => {
    const data = {} as any
    data.limit_to_job = userJob.value
    if (!_.isNil(watchDrawingId)) {
      data.excluded_drawings = [(watchDrawingId as DataForDropdown).value]
    }
    return data
  }

  const additionalDataPart = getAdditionalDataPart()

  const handleChangeDrawingId = async (event, optionValue: DataForDropdown) => {
    setDefaultPartList([])
    dispatch(partStore.actions.setPartLoading(true))
    itemForm.setValue('drawing_id', optionValue)
    try {
      const { generated_code } = await itemApi.getGenerateCode(optionValue.value)
      itemForm.setValue('dpn', generated_code)
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    dispatch(partStore.actions.setPartLoading(false))
  }

  const handleSetOpenCopyItem = (isOpen: boolean) => () => {
    if (_.isNull(watchRefTo)) {
      setOpenCopyItem(isOpen)
    }
  }

  const displayConfirmRefDialog = async (message: string) => {
    await confirm({
      title: 'Warning',
      description: message,
      buttons: [{ label: 'Ok', action: 'OK' }]
    })
  }

  const getPart = async (selectedPart: DataForDropdown) => {
    const formData = itemForm.getValues()
    const reqPayload = {
      selected_part: selectedPart?.value || null,
      selected_drawing: (formData.drawing_id as DataForDropdown)?.value,
      current_item: isCreating ? null : formData.id
    }
    dispatch(partStore.actions.setPartLoading(true))
    try {
      const { part, message } = await partApi.getReferencedPart(reqPayload)
      const reference_to = {
        description: '',
        entity_id: part.dpn,
        value: part.id
      }
      itemForm.setValue('descriptions', part.descriptions)
      itemForm.setValue('manufacturer_equiv', part.manufacturer_equiv_object)
      itemForm.setValue('manufacturers', part.manufacturers)
      itemForm.setValue('mass', part.mass)
      itemForm.setValue('material_equiv', part.material_equiv_object)
      itemForm.setValue('unit', part.unit)
      itemForm.setValue('manufacturer_equiv_standards', part.manufacturer_equiv_standards)
      itemForm.setValue('material_equiv_standards', part.material_equiv_standards)
      itemForm.setValue('reference_to', reference_to)
      if (selectedPart.value !== part.id) {
        displayConfirmRefDialog(message)
      } else {
        dispatch(commonStore.actions.setSuccessMessage(message))
      }
    } catch (error) {
      const { status, data } = error.response
      if (status === StatusCode.BAD_REQUEST) {
        displayConfirmRefDialog(data.message)
      }
    }
    dispatch(partStore.actions.setPartLoading(false))
  }

  const handleSelectPart = (event, optionValue: DataForDropdown, reason: AutocompleteChangeReason) => {
    if (reason === 'clear') {
      itemForm.setValue('reference_to', null)
    } else {
      getPart(optionValue)
    }
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppAutocomplete
                helperText={itemForm.errors.job_id?.message}
                error={Boolean(itemForm.errors.job_id)}
                value={userJob}
                popupIcon={null}
                disabled
                label="Job"
                required
                primaryKeyOption="value"
                options={[]}
                renderOption={(option) => option.description}
              />
            </Grid>
            <Grid item xs={12}>
              <AppAutocompleteAsync
                popupIcon={entity === 'drawing' ? null : <DropdownIcon />}
                helperText={itemForm.errors.drawing_id?.message}
                error={Boolean(itemForm.errors.drawing_id)}
                disabled={!isCreating || entity === 'drawing'}
                value={watchDrawingId}
                compName="drawing_list"
                additionalData={{ limit_to_job: userJob.value }}
                required
                label="Drawing #"
                onChange={handleChangeDrawingId}
              />
            </Grid>
            <Grid item xs={8}>
              <FormControllerTextField
                disabled={!isCreating}
                control={itemForm.control}
                name="dpn"
                required
                label="Item #"
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                startIcon={<CopyIcon />}
                style={{ padding: '0 4px', textTransform: 'capitalize' }}
                onClick={handleSetOpenCopyItem(true)}
                disabled={Boolean(watchRefTo)}
              >
                {t('button.copy_attribute')}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <AppAutocompleteAsync
                disabled={!watchDrawingId}
                disableClearable={false}
                value={watchRefTo}
                compName="part_list"
                additionalData={additionalDataPart}
                label="Reference Part Number"
                onChange={handleSelectPart}
                defaultOptions={defaultPartList}
                filterOptions={(options) => {
                  if (_.isNil(options)) {
                    return []
                  }
                  if (isCreating) {
                    return options
                  }
                  return _.filter(options, (option) => option.value !== watchId)
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControllerNumberField
                control={itemForm.control}
                name="mass"
                required
                label="Mass (kg)"
                disabled={Boolean(watchRefTo)}
                decimalScale={itemMassFormat.precision}
                fixedDecimalScale={itemMassFormat.precision}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControllerAutocomplete
                control={itemForm.control}
                name="unit"
                required
                label="Unit"
                primaryKeyOption="value"
                options={parameters.UNIT}
                renderOption={(option) => option.description}
                disabled={Boolean(watchRefTo)}
              />
            </Grid>
            <When condition={!isCreating}>
              <Grid item xs={12} style={{ padding: 0 }}>
                <SectionTimezone value={itemFormData} />
              </Grid>
            </When>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <TableMultilingualDescription
            disabled={Boolean(watchRefTo)}
            languageList={parameters.PLLA}
            editMode={!isCreating}
            name="descriptions"
            tableHeight={290}
            control={itemForm.control}
            copyable
            copyDialogProps={{
              checkboxesToSelect: [
                {
                  label: 'Drawing',
                  value: 'drawing_list',
                  entity: 'drawings'
                },
                {
                  label: 'Item/Assembly',
                  value: 'part_list',
                  entity: 'parts',
                  default: true
                }
              ]
            }}
          />
        </Grid>
      </Grid>

      <DialogCopyItem open={openCopyItem} onClose={handleSetOpenCopyItem(false)} />
    </>
  )
}

export default TabGeneral
