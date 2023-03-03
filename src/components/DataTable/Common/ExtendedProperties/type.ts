import { PaperProps } from '@material-ui/core'
import { UseControllerOptions } from 'react-hook-form'

export interface TableExtendedPropertiesProps
  extends Omit<UseControllerOptions, 'onFocus'>,
    Omit<PaperProps, 'defaultValue'> {
  propertiesList: any[]
  parameterName: string
  defaultValue?: any
  tableHeight?: number | string
  editMode?: boolean
}
