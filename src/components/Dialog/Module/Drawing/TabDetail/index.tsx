import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import useStyles from './styles'
import { useSelector } from 'react-redux'

import { Button, FormControl, Grid, Paper, Switch, Typography } from '@material-ui/core'

import { AppTitle, DataTable, DeleteIcon, FormControllerCheckbox, CreateIcon, AppAutocompleteAsync } from '@/components'

import _ from 'lodash'
import * as columnProperties from '@/utils/columnProperties'
import { drawingStore, commonStore } from '@/store/reducers'

import type { DrawingDetail } from '@/types/Drawing'

function TabDetail() {
  const classes = useStyles()

  const [selectedDocs, setSelectedDocs] = useState([])
  const [selectedDocOptions, setSelectedDocOptions] = useState([])

  const drawingForm = useFormContext<DrawingDetail>()
  const watchAssociatedDocs = drawingForm.watch('associated_documents', [])
  const watchDrawingsWithoutParts = drawingForm.watch('drawings_without_parts', false)

  const userJob = useSelector(commonStore.selectUserValueJob)
  const drawingDetail = useSelector(drawingStore.selectDetail)

  const isCreating = _.isNil(drawingDetail.id)

  const handleAddDocs = () => {
    const { associated_documents } = drawingForm.getValues()
    associated_documents.push(...selectedDocOptions)
    drawingForm.setValue('associated_documents', associated_documents)
    setSelectedDocOptions([])
  }

  const handleSelectDoc = ({ selectionModel }) => {
    setSelectedDocs(selectionModel)
  }

  const handleDeleteDocs = () => {
    const { associated_documents } = drawingForm.getValues()
    const newDocs = associated_documents.filter((doc) => !selectedDocs.includes(doc.value))
    setSelectedDocs([])
    drawingForm.setValue('associated_documents', newDocs)
  }

  const handleSelectDrawing = (event, options) => {
    setSelectedDocOptions(options)
  }

  const handleSwitchDrawingSearch = (event, checked) => {
    drawingForm.setValue('drawings_without_parts', checked)
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={6}>
            <AppTitle label="Associated detailed documents" />
          </Grid>
          <Grid item xs={6} className={classes.switchButton}>
            <FormControl style={{}}>
              <Switch
                color="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
                checked={watchDrawingsWithoutParts}
                onChange={handleSwitchDrawingSearch}
              />
            </FormControl>
            <FormControl className={classes.label}>All job/std drawing</FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <AppAutocompleteAsync
              label="Document"
              onChange={handleSelectDrawing}
              compName="drawing_list"
              additionalData={{
                limit_to_job: userJob.value,
                drawings_without_parts: watchDrawingsWithoutParts
              }}
              value={selectedDocOptions}
              multiple
              limitTags={2}
              disableCloseOnSelect
              filterOptions={(options) => {
                if (!options) {
                  return []
                }
                if (isCreating) {
                  return _.differenceWith(options, watchAssociatedDocs, _.isEqual)
                }
                return _.differenceWith(options, watchAssociatedDocs, _.isEqual).filter(
                  (item) => item.value !== drawingDetail.id
                )
              }}
            />
          </Grid>

          <Grid item xs={4} className={classes.buttonGroup}>
            <Button startIcon={<CreateIcon />} disabled={selectedDocOptions.length === 0} onClick={handleAddDocs}>
              Add
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              disabled={selectedDocs.length === 0}
              onClick={handleDeleteDocs}
              style={{ marginTop: -3 }}
            >
              Remove
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <DataTable
            hideFooter
            disableColumnMenu
            checkboxSelection
            tableHeight={300}
            rows={watchAssociatedDocs}
            selectionModel={selectedDocs}
            onSelectionModelChange={handleSelectDoc}
            getRowId={(params) => params.value}
            columns={[
              {
                ...columnProperties.defaultProperties,
                field: 'entity_id',
                flex: 0.5,
                headerName: 'Document'
              },
              {
                ...columnProperties.defaultProperties,
                headerName: 'Description',
                field: 'description',
                flex: 0.5
              }
            ]}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={12}>
            <Typography className={classes.title}>Exclude this drawing from the forward lists</Typography>
          </Grid>
          <Grid item xs={12} style={{ marginTop: 8 }}>
            <FormControllerCheckbox
              control={drawingForm.control}
              name="exclude_from_customer"
              label="Customer"
              className={classes.chkSetAsDefault}
            />
            <FormControllerCheckbox
              control={drawingForm.control}
              name="exclude_from_supplier"
              label="Suppliers"
              className={classes.chkSetAsDefault}
            />
            <FormControllerCheckbox
              control={drawingForm.control}
              name="exclude_from_other"
              label="Others"
              className={classes.chkSetAsDefault}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default TabDetail
