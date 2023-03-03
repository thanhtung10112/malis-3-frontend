import { ComponentsProps } from '@material-ui/core/styles/props'
import { LabComponentsPropsList } from '@material-ui/lab/themeAugmentation'

export const props: ComponentsProps | LabComponentsPropsList = {
  MuiButton: {
    size: 'small',
    disableElevation: true
  },
  MuiCheckbox: {
    size: 'small'
  },
  MuiTextField: {
    size: 'small',
    variant: 'outlined',
    fullWidth: true
  },
  MuiTooltip: {
    arrow: true
  },
  MuiChip: {
    size: 'small'
  },
  MuiSvgIcon: {
    fontSize: 'small'
  },
  MuiAutocomplete: {
    openOnFocus: true
  }
}
