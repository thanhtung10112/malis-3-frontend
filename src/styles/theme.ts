import { createMuiTheme } from '@material-ui/core'
import { props } from '@/styles/vars/props'
import { overrides } from '@/styles/vars/overrides'
import { typography } from '@/styles/vars/typography'

const theme = createMuiTheme({
  props,
  overrides,
  typography,
  shape: {
    borderRadius: 2
  }
})

export default theme
