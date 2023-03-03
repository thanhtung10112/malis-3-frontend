import { ConfirmationOptions } from './type'

export const actionTypes = {
  OK: 'OK',
  CANCEL: 'CANCEL',
  CLOSE: 'CLOSE'
}

export const DEFAULT_OPTIONS = {
  title: 'Confirmation',
  description: '',
  dialogProps: {
    maxWidth: 'xs'
  },
  buttons: [
    {
      label: 'yes',
      action: actionTypes.OK
    },
    {
      label: 'no',
      action: actionTypes.CANCEL
    }
  ]
} as ConfirmationOptions
