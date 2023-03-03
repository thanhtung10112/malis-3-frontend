import React from 'react'
import { Tooltip } from '@material-ui/core'

import parseHTML from 'html-react-parser'
import { isOverflown } from '@material-ui/data-grid'
import _ from 'lodash'

import useStyles from './styles'

function CellExpand(props) {
  const { value, width } = props
  const classes = useStyles({ width })
  const cellValue = React.useRef(null)
  const parseValue = parseHTML(_.toString(value))

  const [showTooltip, setShowTooltip] = React.useState(false)
  const onMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current)
    setShowTooltip(isCurrentlyOverflown)
  }

  const onMouseLeave = () => {
    setShowTooltip(false)
  }

  return (
    <Tooltip title={parseValue} open={showTooltip} classes={{ tooltip: classes.tooltip }}>
      <div ref={cellValue} className={classes.cellValue} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {value}
      </div>
    </Tooltip>
  )
}

export default CellExpand
