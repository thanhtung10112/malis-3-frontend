import { DataForDropdown } from '@/types/Common'
import { AutocompleteChangeDetails, AutocompleteChangeReason } from '@material-ui/lab'
import type { ChangeEvent } from 'react'

import { AppAutocompleteProps } from '../Autocomplete/type'

export interface AppAutocompleteAsyncProps extends Omit<AppAutocompleteProps<any>, 'renderInput' | 'options'> {
  compName: string
  additionalData?: Record<string, any>
  onChange?(
    event: ChangeEvent,
    value: any,
    reason: AutocompleteChangeReason,
    details: AutocompleteChangeDetails<any>
  ): void
  defaultOptions?: DataForDropdown[]
}
