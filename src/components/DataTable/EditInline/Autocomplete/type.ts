import { AppAutocompleteProps } from '@/components/App/Autocomplete/type'
import { GridCellParams } from '@material-ui/data-grid'

export interface DataTableAutocompleteProps extends AppAutocompleteProps<any> {
  params: GridCellParams
}
