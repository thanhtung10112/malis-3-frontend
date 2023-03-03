import { useContext } from 'react'
import Context from '.'

export type UseDialogContext = {
  loading: boolean
}

const useDialogContext = () => {
  const providerValue = useContext(Context) as UseDialogContext
  return providerValue
}

export default useDialogContext
