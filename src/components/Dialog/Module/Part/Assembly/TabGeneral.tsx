import { useFormContext } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'

import { Grid } from '@material-ui/core'
import {
  TableMultilingualDescription,
  AppAutocompleteAsync,
  FormControllerAutocomplete,
  FormControllerTextField,
  SectionTimezone,
  AppAutocomplete,
  DropdownIcon
} from '@/components'
import { Unless } from 'react-if'

import _ from 'lodash'
import assemblyApi from '@/apis/assembly.api'
import AppNumber from '@/helper/AppNumber'
import { partStore, commonStore } from '@/store/reducers'

import type { AssemblyDetail } from '@/types/Assembly'
import type { DataForDropdown } from '@/types/Common'

const TabGeneral = () => {
  const assemblyForm = useFormContext<AssemblyDetail>()
  const formAssemblyData = assemblyForm.getValues()
  const watchId = assemblyForm.watch('id', null)
  const watchDrawingId = assemblyForm.watch('drawing_id', null)

  const isCreating = _.isNil(watchId)

  const dispatch = useDispatch()
  const parameters = useSelector(partStore.selectParameters)
  const entity = useSelector(commonStore.selectEntity)
  const userJob = useSelector(commonStore.selectUserValueJob)

  const handleChangeDrawingId = async (event, optionValue: DataForDropdown) => {
    dispatch(partStore.actions.setPartLoading(true))
    assemblyForm.setValue('drawing_id', optionValue)
    try {
      const { generated_code } = await assemblyApi.getGenerateCode(optionValue.value)
      assemblyForm.setValue('dpn', generated_code)
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    dispatch(partStore.actions.setPartLoading(false))
  }

  const handleBlur = (event) => {
    const { value } = event.target
    if (AppNumber.isNumber(value) && AppNumber.isPositiveNumber(value)) {
      const formatValue = 'G' + value.padStart(3, '0')
      assemblyForm.setValue('dpn', formatValue)
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppAutocomplete
              helperText={assemblyForm.errors.job_id?.message}
              error={Boolean(assemblyForm.errors.job_id)}
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
              helperText={assemblyForm.errors.drawing_id?.message}
              error={Boolean(assemblyForm.errors.drawing_id)}
              disabled={!isCreating || entity === 'drawing'}
              value={watchDrawingId}
              compName="drawing_list"
              additionalData={{ limit_to_job: userJob.value }}
              required
              label="Drawing #"
              onChange={handleChangeDrawingId}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControllerTextField
              disabled={!isCreating}
              control={assemblyForm.control}
              label="Assembly #"
              required
              name="dpn"
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControllerAutocomplete
              control={assemblyForm.control}
              label="Unit"
              name="unit"
              options={parameters.UNIT}
              primaryKeyOption="value"
              required
            />
          </Grid>
          <Unless condition={isCreating}>
            <SectionTimezone value={formAssemblyData} />
          </Unless>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <TableMultilingualDescription
          languageList={parameters.PLLA}
          editMode={!isCreating}
          name="descriptions"
          tableHeight={280}
          control={assemblyForm.control}
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
  )
}

export default TabGeneral
