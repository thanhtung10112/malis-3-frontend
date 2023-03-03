import React from 'react'
import { HelpIcon } from '@/components'
import { Link, Box } from '@material-ui/core'

import type { ButtonHelpProps } from './type'

const BtnHelp: React.FC<ButtonHelpProps> = (props) => {
  const { title, href } = props

  return (
    <Box display="flex">
      <span>{title}</span>
      <Link target="_blank" href={href} style={{ display: 'flex', marginLeft: 4, alignItems: 'center' }}>
        <HelpIcon />
      </Link>
    </Box>
  )
}

export default BtnHelp
