import { useCallback } from 'react'
import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/hooks'

import { Button, Menu, MenuItem } from '@material-ui/core'
import { When } from 'react-if'
import { DropdownIcon } from '@/components'

import _ from 'lodash'

import type { AppButtonProps } from './type'

const AppButton: React.FC<AppButtonProps> = (props) => {
  const { item, children, endIcon, ...buttonProps } = props

  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })

  const renderEndIcon = useCallback(() => {
    if (endIcon) {
      return endIcon
    }
    if (_.isArray(item)) {
      return <DropdownIcon />
    }
    return null
  }, [endIcon])

  const handleClickItem = (callback) => (event) => {
    popupState.close()
    if (_.isFunction(callback)) {
      callback(event)
    }
  }

  const renderMenuItem = useCallback(() => {
    if (!item) {
      return []
    }
    return item.map(({ label, onClick, ...menuProps }, index) => (
      <MenuItem style={{ fontSize: 12 }} key={`${index}-${label}`} {...menuProps} onClick={handleClickItem(onClick)}>
        {label}
      </MenuItem>
    ))
  }, [item, handleClickItem])

  return (
    <>
      <Button {...bindTrigger(popupState)} {...buttonProps} endIcon={renderEndIcon()}>
        {children}
      </Button>
      <When condition={Boolean(item)}>
        <Menu
          {...bindMenu(popupState)}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {renderMenuItem()}
        </Menu>
      </When>
    </>
  )
}

export default AppButton
