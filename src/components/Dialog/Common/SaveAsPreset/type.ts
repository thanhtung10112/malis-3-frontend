import { SubmitHandler, UseControllerOptions } from 'react-hook-form'
import { DialogMainProps } from '@/components/Dialog/Main/type'
export interface DialogSaveAsPresetProps
  extends Omit<DialogMainProps, 'children' | 'defaultValue'>,
    Omit<UseControllerOptions, 'onFocus'> {
  onSubmit: SubmitHandler<any>
  children?: any
}
