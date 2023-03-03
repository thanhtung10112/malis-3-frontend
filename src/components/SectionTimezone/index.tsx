import { Typography } from '@material-ui/core'

import useStyles from './styles'

function SectionTimezone({ value, ...restProps }) {
  const classes = useStyles()
  return (
    <div className={classes.root} {...restProps}>
      <div>
        <Typography variant="body1" component="span" className={classes.timezoneTitle}>
          Created by:{' '}
        </Typography>
        <Typography variant="body1" component="span">
          {value.created_by} {value.created_at}
        </Typography>
      </div>

      <div>
        <Typography variant="body1" component="span" className={classes.timezoneTitle}>
          Updated by:{' '}
        </Typography>
        <Typography variant="body1" component="span">
          {value.updated_by} {value.updated_at}
        </Typography>
      </div>
    </div>
  )
}

export default SectionTimezone
