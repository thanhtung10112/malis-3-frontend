import { Typography, Box } from '@material-ui/core'

import { ExpandMoreOutlined } from '@material-ui/icons'

import Popover from 'material-ui-popup-state/HoverPopover'

import { LinkItem } from '../index'

import useStyles from '../styles'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { usePopupState, bindHover, bindPopover } from 'material-ui-popup-state/hooks'
import { useConfirm } from '@/components/Dialog/Common/Confirmation'

import clsx from 'clsx'
import { commonStore } from '@/store/reducers'
import { unsaveDialogOptions } from '@/utils/constant'

export interface Props {
  label: string
  links: LinkItem[]
}

function NavigationItem(props: Props) {
  const { label, links } = props

  const router = useRouter()
  const classes = useStyles()
  const popupState = usePopupState({
    variant: 'popover',
    popupId: `${label} - links`
  })
  const { confirm } = useConfirm()

  const dispatch = useDispatch()
  const editRows = useSelector(commonStore.selectEditRows)
  const entity = useSelector(commonStore.selectEntity)

  const onRedirectPage = (href) => async (event) => {
    event.preventDefault()
    let result = ''
    if (editRows.length > 0) {
      result = await confirm(unsaveDialogOptions)
    }
    if (result === '') {
      router.push(href)
    } else if (result !== 'cancel') {
      dispatch(commonStore.sagaUpdateMultiple({ entity, href }))
    }
  }

  const activeLink = links.some((link) => link.href === router.pathname)

  return (
    <>
      <div
        className={clsx(classes.navigationItem, {
          [classes.active]: activeLink
        })}
        {...bindHover(popupState)}
      >
        <Typography component={Box} variant="body1" fontWeight="fontWeightMedium" className={classes.label}>
          {label}
        </Typography>
        <span className={classes.dropdownIcon}>
          <ExpandMoreOutlined />
        </span>
      </div>
      {links && (
        <Popover
          {...bindPopover(popupState)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          disableRestoreFocus
        >
          <ul className={classes.dropdownList}>
            {links.map((link) => (
              <li key={link.label + link.href} className={classes.dropdownItem}>
                <a href={link.href} onClick={onRedirectPage(link.href)}>
                  <Typography variant="body1" component="div">
                    <Box fontWeight="fontWeightMedium">{link.label}</Box>
                  </Typography>
                </a>
              </li>
            ))}
          </ul>
        </Popover>
      )}
    </>
  )
}

export default NavigationItem
