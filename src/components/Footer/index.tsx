import React from 'react'

import { Paper } from '@material-ui/core'

import useStyles from './styles'

function Footer() {
  const classes = useStyles()

  return <Paper className={classes.footer}>&copy; Copyright 2021 DREVER INTERNATIONAL</Paper>
}

export default Footer
