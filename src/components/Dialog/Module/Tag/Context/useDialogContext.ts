import { useContext } from 'react'
import Context from '.'

import type { DialogTagProps } from '../type'

export interface UseDialogContext extends DialogTagProps {
  onChangeLoading: (loading: boolean) => void
}

const useDialogContext = () => {
  const providerValue = useContext(Context) as UseDialogContext
  return providerValue
}

export default useDialogContext
