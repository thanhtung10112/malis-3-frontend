import type { AppAutocompleteProps } from '@/components/App/Autocomplete/type'

export interface CustomAutocompleteProps<T> extends AppAutocompleteProps<T> {
  width?: number
  height?: number
}
