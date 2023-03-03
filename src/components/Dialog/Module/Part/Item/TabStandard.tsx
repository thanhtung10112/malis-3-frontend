import { useDispatch } from 'react-redux'
import { useFormContext } from 'react-hook-form'

import { Box, Grid, Paper } from '@material-ui/core'
import { DataTable, AppAutocompleteAsync } from '@/components'

import * as columnProperties from '@/utils/columnProperties'
import { partStore, commonStore } from '@/store/reducers'
import equivalenceApi from '@/apis/equivalence.api'

import type { EquivalenceType } from '@/types/Equivalence'
import type { DataForDropdown } from '@/types/Common'
import type { ItemDetail } from '@/types/Item'

const TabStandard: React.FC = () => {
  const dispatch = useDispatch()

  const partForm = useFormContext<ItemDetail>()
  const watchFormValue = partForm.watch()

  const handleSelectEquivalence = (type: EquivalenceType) => async (event, equiv: DataForDropdown) => {
    dispatch(partStore.actions.setPartLoading(true))
    try {
      const { standards } = await equivalenceApi.getEquivalenceStandards(equiv.value)
      const equivKey = type === 'manufacturing_standard' ? 'manufacturer_equiv' : 'material_equiv'
      const standardKey = `${equivKey}_standards`
      partForm.setValue(standardKey, standards)
      partForm.setValue(equivKey, equiv)
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    dispatch(partStore.actions.setPartLoading(false))
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Box marginBottom={1.5}>
          <AppAutocompleteAsync
            disabled={Boolean(watchFormValue.reference_to)}
            compName="equivalence_list"
            additionalData={{ equiv_type: 'manufacturing_standard' }}
            value={watchFormValue.manufacturer_equiv}
            onChange={handleSelectEquivalence('manufacturing_standard')}
            label="Manufacturing standard"
          />
        </Box>
        <Paper elevation={2}>
          <DataTable
            tableHeight={285}
            hideFooter
            rows={watchFormValue.manufacturer_equiv_standards || []}
            columns={[
              {
                ...columnProperties.defaultProperties,
                field: 'organization',
                headerName: 'Organization',
                flex: 0.5
              },
              {
                ...columnProperties.defaultProperties,
                field: 'description',
                headerName: 'Standard',
                flex: 0.5
              }
            ]}
          />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Box marginBottom={1.5}>
          <AppAutocompleteAsync
            disabled={Boolean(watchFormValue.reference_to)}
            compName="equivalence_list"
            additionalData={{ equiv_type: 'material_standard' }}
            value={watchFormValue.material_equiv}
            onChange={handleSelectEquivalence('material_standard')}
            label="Material standard"
          />
        </Box>
        <Paper elevation={2}>
          <DataTable
            hideFooter
            tableHeight={285}
            rows={watchFormValue.material_equiv_standards || []}
            columns={[
              {
                ...columnProperties.defaultProperties,
                field: 'organization',
                headerName: 'Organization',
                flex: 0.5
              },
              {
                ...columnProperties.defaultProperties,
                field: 'description',
                headerName: 'Standard',
                flex: 0.5
              }
            ]}
          />
        </Paper>
      </Grid>
    </Grid>
  )
}

export default TabStandard
