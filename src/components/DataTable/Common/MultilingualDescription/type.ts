import { PaperProps } from '@material-ui/core'
import { UseControllerOptions } from 'react-hook-form'
import { ParameterOption } from '@/types/Common'
import { DialogCopyDescProps } from './DialogCopyDesc'

export interface TableMultilingualDescriptionProps
  extends Omit<UseControllerOptions, 'onFocus'>,
    Omit<PaperProps, 'defaultValue'> {
  languageList: ParameterOption[]
  editMode: boolean
  editor?: 'text' | 'rte'
  defaultValue?: any
  tableHeight?: number | string
  copyable?: boolean
  copyDialogProps?: Partial<DialogCopyDescProps>
  disabled?: boolean
  autocompleteProps?: any
  descriptionName?: string
}
