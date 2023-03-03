import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { useDispatch } from 'react-redux'
import useDialogContext from '../Context/useDialogContext'

import { Grid, Button, Paper, makeStyles, Box } from '@material-ui/core'

import { DeleteIcon, CreateIcon, DataTable, ViewListIcon, DataTableTextField, AppAutocompleteAsync } from '@/components'
import DialogManufacturerAttr from './DialogManufacturerAttr'

import { partStore } from '@/store/reducers'
import _ from 'lodash'
import * as columnProperties from '@/utils/columnProperties'
import * as yup from 'yup'
import immer from 'immer'

import type { DataForDropdown } from '@/types/Common'
import type { PartDetail } from '@/types/Part'

const useStyles = makeStyles({
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 !important'
  }
})

const TabManufacturer: React.FC = () => {
  const classes = useStyles()
  const { t } = useTranslation('item')
  const { loading } = useDialogContext()

  const [selectedManu, setSelectedManu] = useState([])
  const [selectedManuOptions, setSelectedManuOptions] = useState<DataForDropdown[]>([])
  const [attrDialog, setAttrDialog] = useState({
    open: false,
    attributes: {},
    manufacturerId: null
  })

  const dispatch = useDispatch()

  const partForm = useFormContext<PartDetail>()
  const watchManufacturer = partForm.watch('manufacturers', [])
  const watchReferenceTo = partForm.watch('reference_to', null)

  const handleChangeOption = (event, valueOption: DataForDropdown[]) => {
    setSelectedManuOptions(valueOption)
  }

  const handleAddManu = () => {
    const { manufacturers } = partForm.getValues()
    const mapManufacturers = selectedManuOptions.map((manu) => ({
      manufacturer_id: manu.value,
      reference: '',
      description: manu.description
    }))
    manufacturers.push(...mapManufacturers)
    partForm.setValue('manufacturers', manufacturers)
    setSelectedManuOptions([])
  }

  const handleRemoveManu = () => {
    const { manufacturers } = partForm.getValues()
    const newManus = manufacturers.filter((manu) => !selectedManu.includes(manu.manufacturer_id))
    setSelectedManu([])
    partForm.setValue('manufacturers', newManus)
  }

  const handleSelectManu = ({ selectionModel }) => {
    setSelectedManu(selectionModel)
  }

  /**
   * @param {number} id
   * @param {string} value
   */
  const handleChangeReference = (id, value) => {
    const { manufacturers } = partForm.getValues()
    const newManufacturers = immer(manufacturers, (draft) => {
      const index = _.findIndex(draft, { manufacturer_id: id })
      draft[index].reference = value
    })
    partForm.setValue('manufacturers', newManufacturers)
  }

  const handleOpenAttrDialog =
    ({ additional_attributes, manufacturer_id }) =>
    () => {
      setAttrDialog((prevState) =>
        immer(prevState, (draft) => {
          draft.open = true
          draft.attributes = additional_attributes || {}
          draft.manufacturerId = manufacturer_id
        })
      )
    }

  const handleChangeAttr = (attributes) => {
    const { manufacturers } = partForm.getValues()
    const newManufacturers = immer(manufacturers, (draft) => {
      const index = _.findIndex(manufacturers, {
        manufacturer_id: attrDialog.manufacturerId
      })
      if (index !== -1) {
        draft[index].additional_attributes = attributes
      }
    })
    partForm.setValue('manufacturers', newManufacturers)
  }

  const handleCloseAttrDialog = () => {
    setAttrDialog((prevState) =>
      immer(prevState, (draft) => {
        draft.open = false
      })
    )
  }

  const handleCreateManu = () => {
    const formData = partForm.getValues()
    dispatch(partStore.sagaOpenManuDialog(formData))
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <AppAutocompleteAsync
            disabled={Boolean(watchReferenceTo)}
            label="Manufacturer"
            compName="manufacturer_list"
            value={selectedManuOptions}
            multiple
            limitTags={2}
            disableCloseOnSelect
            onChange={handleChangeOption}
            getOptionDisabled={(option) => watchManufacturer.some((manu) => manu.manufacturer_id === option.value)}
          />
        </Grid>
        <Grid item xs={4} className={classes.buttonGroup}>
          <Button
            startIcon={<CreateIcon />}
            onClick={handleAddManu}
            disabled={selectedManuOptions.length === 0 || Boolean(watchReferenceTo)}
          >
            {t('common:button.add')}
          </Button>
          <Box>
            <Button startIcon={<CreateIcon />} onClick={handleCreateManu} disabled={loading}>
              {t('common:button.new')}
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              onClick={handleRemoveManu}
              disabled={selectedManu.length === 0 || Boolean(watchReferenceTo)}
            >
              {t('common:button.remove')}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={2}>
            <DataTable
              checkboxSelection={!watchReferenceTo}
              hideFooter
              tableHeight={270}
              selectionModel={selectedManu}
              onSelectionModelChange={handleSelectManu}
              getRowId={(param) => param.manufacturer_id}
              rows={watchManufacturer}
              onCellClick={(params, event) => {
                if (params.field === 'manufacturer_id') {
                  event.stopPropagation()
                }
              }}
              columns={[
                {
                  ...columnProperties.defaultProperties,
                  field: 'description',
                  headerName: 'Manufacturers',
                  flex: 0.3
                },
                {
                  ...columnProperties.defaultProperties,
                  ...columnProperties.editCell('Reference', !watchReferenceTo),
                  field: 'reference',
                  flex: 0.4,
                  renderEditCell(params) {
                    return (
                      <DataTableTextField
                        rules={yup.string().max(255, t('validation_message.manu_ref_max'))}
                        params={params}
                        onChangeValue={handleChangeReference}
                      />
                    )
                  }
                },
                {
                  ...columnProperties.defaultProperties,
                  ...columnProperties.centerColumn,
                  field: 'manufacturer_id',
                  headerName: 'Attributes',
                  flex: 0.3,
                  renderCell(params) {
                    return <ViewListIcon onClick={handleOpenAttrDialog(params.row as any)} />
                  }
                }
              ]}
            />
          </Paper>
        </Grid>
      </Grid>
      <DialogManufacturerAttr
        open={attrDialog.open}
        attributes={attrDialog.attributes}
        onChange={handleChangeAttr}
        onClose={handleCloseAttrDialog}
      />
    </>
  )
}

export default TabManufacturer
