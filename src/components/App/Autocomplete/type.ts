import type { OutlinedTextFieldProps } from '@material-ui/core'
import type { AutocompleteProps } from '@material-ui/lab'

type DropdownInputProps = 'label' | 'required' | 'error' | 'helperText'

export interface AppAutocompleteProps<T>
  extends Omit<AutocompleteProps<T, boolean, boolean, boolean>, 'renderInput'>,
    Pick<OutlinedTextFieldProps, DropdownInputProps> {
  textFieldProps?: Omit<OutlinedTextFieldProps, 'variant' | 'label' | 'required' | 'error' | 'helperText'>
  primaryKeyOption?: string
  variant?: string
}
