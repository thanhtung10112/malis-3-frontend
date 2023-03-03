import { useFormContext } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'

import { Grid, Link, Box } from '@material-ui/core'
import {
  TableMultilingualDescription,
  AppAutocompleteAsync,
  FormControllerTextField,
  SectionTimezone,
  AppAutocomplete
} from '@/components'
import { Unless } from 'react-if'

import _ from 'lodash'
import AppNumber from '@/helper/AppNumber'
import { specificationStore, commonStore } from '@/store/reducers'

import type { SpecificationDetail } from '@/types/Specification'
import type { DataForDropdown } from '@/types/Common'

const TabGeneral = () => {
  const specificationForm = useFormContext<SpecificationDetail>()

  const dispatch = useDispatch()
  const parameters = useSelector(specificationStore.selectParameters)
  const specificationDetail = useSelector(specificationStore.selectDetail)
  const userJob = useSelector(commonStore.selectUserValueJob)

  const isCreating = _.isNil(specificationDetail.id)

  const handleChangeDrawingId = (event, drawing: DataForDropdown) => {
    const formData = specificationForm.getValues()
    dispatch(specificationStore.sagaGenerateCode({ formData, drawing }))
  }

  const handleBlur = (event) => {
    const { value } = event.target
    if (AppNumber.isNumber(value) && AppNumber.isPositiveNumber(value) && value !== '') {
      const formatValue = 'D' + value.padStart(3, '0')
      specificationForm.setValue('spec_id', formatValue)
    }
  }

  const handleOpenDrawing = (event) => {
    event.preventDefault()
    const formData = specificationForm.getValues()
    dispatch(specificationStore.sagaOpenDrawingDialog(formData))
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ marginTop: 8 }}>
            <AppAutocomplete
              helperText={specificationForm.errors.job_id?.message}
              error={Boolean(specificationForm.errors.job_id)}
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
              helperText={specificationForm.errors.drawing_id?.message}
              error={Boolean(specificationForm.errors.drawing_id)}
              disabled={!isCreating}
              value={specificationDetail.drawing_id}
              compName="drawing_list"
              additionalData={{ limit_to_job: userJob.value }}
              required
              label="Drawing #"
              onChange={handleChangeDrawingId}
            />
          </Grid>
          <Unless condition={isCreating}>
            <Grid item xs={12} component={Box} display="flex" justifyContent="flex-end">
              <Link href="#" onClick={handleOpenDrawing}>
                View Drawing Info
              </Link>
            </Grid>
          </Unless>
          <Grid item xs={12}>
            <FormControllerTextField
              disabled={!isCreating}
              control={specificationForm.control}
              label="Document #"
              required
              name="spec_id"
              onBlur={handleBlur}
            />
          </Grid>

          <Unless condition={isCreating}>
            <SectionTimezone value={specificationDetail} />
          </Unless>
        </Grid>
      </Grid>

      <Grid item xs={6}>
        <TableMultilingualDescription
          languageList={parameters.PLLA}
          editMode={!isCreating}
          name="descriptions"
          tableHeight={290}
          control={specificationForm.control}
          editor="rte"
          copyable
          copyDialogProps={{
            compName: 'specification_list',
            entity: 'specifications'
          }}
          autocompleteProps={{
            getOptionLabel: (option) => option.entity_id
          }}
        />
      </Grid>
    </Grid>
  )
}

export default TabGeneral
