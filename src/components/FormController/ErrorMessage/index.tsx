import { Tooltip, Typography, TooltipProps } from '@material-ui/core'

import useStyles from './styles'

function ErrorMessage({ title, ...props }: TooltipProps) {
  const classes = useStyles()
  return (
    <Tooltip {...props} title={<Typography variant="body2">{title}</Typography>} classes={{ ...classes }}>
      {props.children}
    </Tooltip>
  )
}

export default ErrorMessage
