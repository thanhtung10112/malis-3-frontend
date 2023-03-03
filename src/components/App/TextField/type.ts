import type { StandardTextFieldProps } from '@material-ui/core'

export interface AppTextFieldProps extends StandardTextFieldProps {
  generateCode?: boolean
  tooltip?: string
  loading?: boolean
  onGenerateCode?: (event) => void
}
