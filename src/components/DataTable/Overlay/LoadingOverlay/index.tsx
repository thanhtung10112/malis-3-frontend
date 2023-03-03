import { GridOverlay } from '@material-ui/data-grid'
import LinearProgress from '@material-ui/core/LinearProgress'

import useStyles from './styles'

function LoadingOverlay() {
  const classes = useStyles()
  return (
    <GridOverlay className={classes.loading__overlay}>
      <div className={classes.loading__process}>
        <LinearProgress />
      </div>
    </GridOverlay>
  )
}

export default LoadingOverlay
