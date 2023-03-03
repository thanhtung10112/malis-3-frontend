import { ButtonProps } from '@material-ui/core'

export interface ButtonItemDropdown {
  label: string
  disabled?: boolean
  onClick?: () => void
}

export interface AppButtonProps extends ButtonProps {
  item?: ButtonItemDropdown[]
}
