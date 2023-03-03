import React from 'react'

import { Grid, Link, Box } from '@material-ui/core'

import { Unless } from 'react-if'

import {
  TableMultilingualDescription,
  FormControllerAutocomplete,
  FormControllerTextField,
  SectionTimezone,
  DialogMain,
  AppAutocomplete,
  FormControllerCheckbox
} from '@/components'

import { useSelector } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import useStyles from './styles'

import _ from 'lodash'

import { drawingStore, commonStore } from '@/store/reducers'

import type { DrawingDetail } from '@/types/Drawing'

function TabGeneral() {
  const classes = useStyles()
  const drawingForm = useFormContext<DrawingDetail>()

  const [openLink, setOpenLink] = React.useState(false)

  const drawingDetail = useSelector(drawingStore.selectDetail)
  const parameters = useSelector(drawingStore.selectParameters)
  const userJob = useSelector(commonStore.selectUserValueJob)

  const isCreating = _.isNil(drawingDetail.id)

  const handleChangePurpose = (optionValue) => {
    const { DWPU } = parameters
    const option = _.find(DWPU, { id: optionValue.value }) as any
    const { exclude_from } = option.properties
    const excludeList = {
      C: 'exclude_from_customer',
      O: 'exclude_from_other',
      S: 'exclude_from_supplier'
    }
    const excludeFrom = exclude_from ? exclude_from.split(';') : [] // C;O;S => [C, O, S]
    _.forIn(excludeList, (value, key) => {
      if (excludeFrom.includes(key)) {
        drawingForm.setValue(value, true)
      } else {
        drawingForm.setValue(value, false)
      }
    })
  }

  const handleOpenInfoLink = (event) => {
    event.preventDefault()
    setOpenLink(true)
  }

  const handleCloseInfoLink = () => {
    setOpenLink(false)
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppAutocomplete
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
              <FormControllerTextField
                control={drawingForm.control}
                required
                label="Drawing #"
                name="drawing_id"
                disabled={!isCreating}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControllerTextField label="Customer ID" control={drawingForm.control} name="customer_id" />
            </Grid>
            <Grid item xs={12}>
              <FormControllerTextField
                control={drawingForm.control}
                name="revision"
                label="Revision"
                required
                transformValue={(value) => value.toUpperCase()}
                disabled={!isCreating}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControllerAutocomplete
                primaryKeyOption="value"
                name="drawing_format"
                control={drawingForm.control}
                options={parameters.PLFO}
                renderOption={(option) => option.description}
                label="Format"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControllerAutocomplete
                disableClearable={false}
                primaryKeyOption="value"
                name="file_type"
                control={drawingForm.control}
                options={parameters.FTYP}
                label="File Type"
                renderOption={(option) => option.description}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControllerAutocomplete
                primaryKeyOption="value"
                name="drawing_purpose"
                control={drawingForm.control}
                options={parameters.DWPU}
                label="Purpose"
                required
                renderOption={(option) => option.description}
                onChange={handleChangePurpose}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControllerAutocomplete
                primaryKeyOption="value"
                name="file_prefix"
                control={drawingForm.control}
                options={parameters.FPRE}
                label="File Prefix"
                renderOption={(option) => option.description}
              />
            </Grid>

            <Grid item xs={12} style={{ paddingBottom: 0 }}>
              <Box display="flex">
                <FormControllerCheckbox control={drawingForm.control} name="is_drawing" label="Is Drawing" />
                <FormControllerCheckbox control={drawingForm.control} name="is_schematic" label="Is Schematic" />
                <FormControllerCheckbox
                  control={drawingForm.control}
                  name="is_specification"
                  label="Is Specification"
                />
                <FormControllerCheckbox
                  control={drawingForm.control}
                  name="is_other_document"
                  label="Is Other Document"
                />
              </Box>
              <Box marginTop={1}>
                <FormControllerCheckbox
                  control={drawingForm.control}
                  name="is_detail_drawing"
                  label="Is Details Document"
                />
              </Box>

              <Unless condition={isCreating}>
                <div className={classes.buttonsGeneral}>
                  <Link>View Contract Items</Link>
                  <Box display="flex" alignItems="center">
                    <Link target="_blank" href={drawingDetail.url}>
                      Actual drawing
                    </Link>
                    <Link style={{ marginLeft: 4 }} onClick={handleOpenInfoLink}>
                      [i]
                    </Link>
                  </Box>
                </div>

                <SectionTimezone value={drawingDetail} style={{ padding: 0 }} />
              </Unless>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <TableMultilingualDescription
            tableHeight={400}
            name="descriptions"
            control={drawingForm.control}
            editMode={!isCreating}
            languageList={parameters.PLLA as any}
            copyable
            copyDialogProps={{
              compName: 'drawing_list',
              entity: 'drawings'
            }}
          />
        </Grid>
      </Grid>
      <DialogMain
        open={openLink}
        title="Infomation"
        description={drawingDetail.windows_path}
        onClose={handleCloseInfoLink}
      />
    </>
  )
}

export default TabGeneral
