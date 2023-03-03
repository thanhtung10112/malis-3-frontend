import { useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Grid, Button, Paper } from '@material-ui/core'
import { CreateIcon, DeleteIcon, DataTable, AppAutocomplete } from '@/components'

import _ from 'lodash'
import { locationStore } from '@/store/reducers'
import { centerColumn, defaultProperties } from '@/utils/columnProperties'

const TabSpecialties: React.FC = () => {
  const { t } = useTranslation()

  const [selectedSpecialties, setSelectedSpecialties] = useState([])
  const [selectedRows, setSelectedRows] = useState([])

  const locationForm = useFormContext()
  const watchSpecialties = locationForm.watch('specialties', '')

  const { parameters } = useSelector(locationStore.selectInitDataForCE)

  const specialtiesList = useMemo(() => {
    if (!watchSpecialties) {
      return []
    }
    const list = watchSpecialties.split(';')
    return parameters.SSPE.filter((item) => list.includes(item.parameter_id))
  }, [watchSpecialties])

  const filterOptions = useCallback(
    (options) => _.differenceWith(options, specialtiesList, _.isEqual),
    [specialtiesList]
  )

  const handleAddSpecialties = () => {
    const idSpecialties = selectedSpecialties.map(({ parameter_id }) => parameter_id).join(';')
    setSelectedSpecialties([])
    const newList = watchSpecialties ? `${watchSpecialties};${idSpecialties}` : idSpecialties
    locationForm.setValue('specialties', newList)
  }

  const handleSelectSpecialties = (_, specialties) => {
    setSelectedSpecialties(specialties)
  }

  const handleSelectRows = (params) => {
    setSelectedRows(params.selectionModel)
  }

  const handleRemoveRows = () => {
    const filterItem = specialtiesList
      .filter((item) => !selectedRows.includes(item.id))
      .map((item) => item.parameter_id)
      .join(';')
    setSelectedRows([])
    locationForm.setValue('specialties', filterItem)
  }

  return (
    <>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={8}>
          <AppAutocomplete
            label="Specialties"
            style={{ marginTop: 4 }}
            value={selectedSpecialties}
            multiple
            limitTags={2}
            disableCloseOnSelect
            options={parameters.SSPE}
            filterOptions={filterOptions}
            renderOption={({ parameter_id, description }) => `${parameter_id} - ${description}`}
            onChange={handleSelectSpecialties}
          />
        </Grid>

        <Grid item xs={2}>
          <Button startIcon={<CreateIcon />} disabled={selectedSpecialties.length === 0} onClick={handleAddSpecialties}>
            {t('common:button.add')}
          </Button>
        </Grid>

        <Grid item xs={2} style={{ padding: 0 }}>
          <Button startIcon={<DeleteIcon />} disabled={selectedRows.length === 0} onClick={handleRemoveRows}>
            {t('common:button.remove')}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={2}>
            <DataTable
              rows={specialtiesList}
              columns={[
                {
                  ...defaultProperties,
                  ...centerColumn,
                  field: 'parameter_id',
                  headerName: 'Parameter #',
                  flex: 0.25
                },
                {
                  ...defaultProperties,
                  field: 'description',
                  headerName: 'Description',
                  flex: 0.85
                }
              ]}
              hideFooter
              tableHeight={430}
              checkboxSelection
              selectionModel={selectedRows}
              onSelectionModelChange={handleSelectRows}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default TabSpecialties
