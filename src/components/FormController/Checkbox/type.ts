import { FormControlLabelProps } from '@material-ui/core'

import { UseControllerOptions } from 'react-hook-form'

export interface ControlledCheckboxProps
  extends Omit<FormControlLabelProps, 'control' | 'color' | 'defaultValue' | 'name'>,
    Omit<UseControllerOptions, 'onFocus'> {
  color?: 'default' | 'primary' | 'secondary'
}
