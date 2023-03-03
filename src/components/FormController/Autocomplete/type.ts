import { AppAutocompleteProps } from '@/components/App/Autocomplete/type'
import type { UseControllerOptions } from 'react-hook-form'

export interface FormControllerAutocompleteProps
  extends Omit<AppAutocompleteProps<any>, 'defaultValue' | 'onFocus'>,
    UseControllerOptions {}
