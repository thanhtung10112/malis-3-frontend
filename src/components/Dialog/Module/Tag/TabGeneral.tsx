import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import useStyles from './styles'
import useDialogContext from './Context/useDialogContext'

import { Grid } from '@material-ui/core'
import {
  TableMultilingualDescription,
  AppAutocompleteAsync,
  FormControllerTextField,
  SectionTimezone,
  AppAutocomplete,
  FormControllerNumberField,
  useConfirm
} from '@/components'
import { Unless } from 'react-if'

import _ from 'lodash'
import partApi from '@/apis/part.api'
import tagApi from '@/apis/tag.api'
import { commonStore } from '@/store/reducers'
import { StatusCode } from '@/utils/StatusCode'

import type { AutocompleteChangeReason } from '@material-ui/lab'
import type { TagDetail } from '@/types/Tag'
import type { DataForDropdown } from '@/types/Common'

const TabGeneral = () => {
  const classes = useStyles()
  const { confirm } = useConfirm()

  const [defaultPartList, setDefaultPartList] = useState([])

  const tagForm = useFormContext<TagDetail>()
  const watchSchematic = tagForm.watch('schematic_id', null) as DataForDropdown
  const watchPartId = tagForm.watch('part_id', null) as DataForDropdown
  const watchId = tagForm.watch('id', null)

  const { detail, initData, onChangeLoading } = useDialogContext()
  const { parameters } = initData

  const dispatch = useDispatch()
  const userJob = useSelector(commonStore.selectUserValueJob)

  const isCreating = _.isNil(detail.id)

  const handleChangeSchematicId = async (event, optionValue: DataForDropdown) => {
    setDefaultPartList([])
    onChangeLoading(true)
    try {
      tagForm.clearErrors('schematic_id')
      tagForm.setValue('schematic_id', optionValue)
      const { generated_code } = await tagApi.getGenerateCode(optionValue.value)
      tagForm.setValue('element_id', generated_code)
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    onChangeLoading(false)
  }

  const handleFormatElementId = (event) => {
    const { value } = event.target
    if (_.size(value) > 0) {
      const formatValue = value.padStart(4, '0')
      tagForm.setValue('element_id', formatValue)
    }
  }

  const getAdditionalDataPart = () => {
    const data = {} as any
    data.limit_to_job = userJob.value
    if (!_.isNil(watchSchematic)) {
      data.excluded_drawings = [(watchSchematic as DataForDropdown).value]
    }
    return data
  }

  const additionalDataPart = getAdditionalDataPart()

  const displayConfirmRefDialog = async (message: string) => {
    await confirm({
      title: 'Warning',
      description: message,
      buttons: [{ label: 'Ok', action: 'OK' }]
    })
  }

  const getPart = async (selectedPart: DataForDropdown) => {
    onChangeLoading(true)
    try {
      const formData = tagForm.getValues()
      const reqPayload = {
        selected_part: selectedPart.value,
        selected_drawing: (formData.schematic_id as DataForDropdown)?.value,
        current_item: formData.id || null
      }
      const { part, message } = await partApi.getReferencedPart(reqPayload)
      const partFormat: DataForDropdown = {
        description: '',
        entity_id: part.dpn,
        value: part.id
      }
      tagForm.setValue('part_id', partFormat)
      tagForm.setValue('descriptions', part.descriptions)
      if (selectedPart.value !== part.id) {
        displayConfirmRefDialog(message)
      } else {
        dispatch(commonStore.actions.setSuccessMessage(message))
      }
    } catch (error) {
      const { status, message } = error
      if (status === StatusCode.BAD_REQUEST) {
        displayConfirmRefDialog(message)
      } else {
        dispatch(commonStore.actions.setError(error))
      }
    }
    onChangeLoading(false)
  }

  const handleSelectPart = (event, optionValue: DataForDropdown, reason: AutocompleteChangeReason) => {
    if (reason === 'clear') {
      tagForm.setValue('part_id', null)
    } else {
      getPart(optionValue)
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ marginTop: 8 }}>
            <AppAutocomplete
              helperText={tagForm.errors.job_id?.message}
              error={Boolean(tagForm.errors.job_id)}
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
              disabled={!isCreating}
              helperText={tagForm.errors.schematic_id?.message}
              error={Boolean(tagForm.errors.schematic_id)}
              value={watchSchematic}
              compName="drawing_list"
              additionalData={{ limit_to_job: userJob.value }}
              required
              label="Schematic #"
              onChange={handleChangeSchematicId}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControllerNumberField
              allowLeadingZeros
              disabled={!isCreating}
              fixedDecimalScale={false}
              decimalScale={null}
              thousandSeparator=""
              isNumericString
              control={tagForm.control}
              label="Element #"
              required
              name="element_id"
              onBlur={handleFormatElementId}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControllerTextField control={tagForm.control} label="Tag #" name="tag" required />
          </Grid>

          <Grid item xs={12}>
            <AppAutocompleteAsync
              disabled={!watchSchematic}
              disableClearable={false}
              value={watchPartId}
              compName="part_list"
              additionalData={additionalDataPart}
              label="Part #"
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
        </Grid>
      </Grid>

      <Grid item xs={6}>
        <TableMultilingualDescription
          languageList={parameters.PLLA}
          editMode={!isCreating}
          name="descriptions"
          tableHeight={160}
          control={tagForm.control}
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
                entity: 'parts'
              },
              {
                label: 'Tag',
                value: 'element_list',
                entity: 'elements',
                default: true
              }
            ]
          }}
          disabled={Boolean(watchPartId)}
        />
      </Grid>

      <Grid item xs={12}>
        <div className={classes.tabGeneral__divider} />
      </Grid>

      <Grid item xs={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControllerTextField control={tagForm.control} label="Fluid" name="fluid" />
          </Grid>
          <Grid item xs={12}>
            <FormControllerTextField control={tagForm.control} label="Tech. data" name="tech_data" />
          </Grid>
        </Grid>

        <Unless condition={isCreating}>
          <SectionTimezone value={detail} />
        </Unless>
      </Grid>

      <Grid item xs={6}>
        <TableMultilingualDescription
          languageList={parameters.PLLA}
          editMode={!isCreating}
          name="functions"
          descriptionName="function"
          tableHeight={160}
          control={tagForm.control}
          copyable
          copyDialogProps={{
            compName: 'element_list',
            entity: 'elements'
          }}
        />
      </Grid>
    </Grid>
  )
}

export default TabGeneral
