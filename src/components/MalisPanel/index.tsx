import { When } from 'react-if'

import type { HTMLAttributes, ReactNode } from 'react'

export interface TabPanelProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <When condition={value === index}>{children}</When>
    </div>
  )
}

export default TabPanel
