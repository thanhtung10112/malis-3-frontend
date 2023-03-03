import { useContext } from 'react'
import { ConfirmationOptions } from './type'
import ConfirmContext from './ConfirmContext'

export type UseConfirm = {
  confirm: Confirm
  handleClose(): void
}
export type Confirm = (option?: Partial<ConfirmationOptions>) => Promise<string>

const useConfirm = () => {
  const confirm = useContext(ConfirmContext) as UseConfirm
  return confirm
}

export default useConfirm
