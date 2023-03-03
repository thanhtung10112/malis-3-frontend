import { useContext } from 'react'
import Context from '.'

export type UseDialogContext = {
  isCreating: boolean
}

const useDialogContext = () => {
  const providerValue = useContext(Context) as UseDialogContext
  return providerValue
}

export default useDialogContext
