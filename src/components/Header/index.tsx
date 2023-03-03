import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import NextLink from 'next/link'

import { AppBar, Typography, Avatar, Box } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import { AccountCircle } from '@material-ui/icons'
import { If, Else, Then } from 'react-if'
import { MalisNavigation } from '@/components/index'
import { unsaveDialogOptions } from '@/utils/constant'

import logo from '../../public/malis_logo.gif'

import Popover from 'material-ui-popup-state/HoverPopover'
import { usePopupState, bindHover, bindPopover } from 'material-ui-popup-state/hooks'

import { useConfirm } from '@/components/index'
import useStyles from './styles'

import { authStore, commonStore } from '@/store/reducers'

function Header() {
  const dispatch = useDispatch()

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'demoPopover'
  })

  const profile = useSelector(authStore.selectProfile)
  const loadingAuth = useSelector(authStore.selectLoadingAuth)
  const editRows = useSelector(commonStore.selectEditRows)

  const classes = useStyles()

  const { confirm } = useConfirm()

  useEffect(() => {
    dispatch(authStore.sagaGetProfile())
  }, [])

  const onLogout = async () => {
    let result = ''
    if (editRows.length > 0) {
      result = await confirm(unsaveDialogOptions)
    }
    if (result !== 'cancel') {
      dispatch(authStore.sagaLogout({ confirm: result }))
    }
  }

  return (
    <>
      <AppBar className={classes.header} position="static">
        <div id="logo" role="logo">
          <img src={logo} alt="The logo" width={148} height={32} />
        </div>
        <div style={{ display: 'flex', height: '100%' }}>
          <MalisNavigation />
          <If condition={loadingAuth}>
            <Then>
              <Box className={classes.profile__loading}>
                <Skeleton variant="circle" className={classes.profile__avatar} />
                <Skeleton variant="text" width={85} />
              </Box>
            </Then>
            <Else>
              <div className={classes.profile} style={{ marginLeft: 12 }} {...bindHover(popupState)}>
                <If condition={Boolean(profile.avatar)}>
                  <Then>
                    <Avatar src={profile.avatar} className={classes.profile__avatar} />
                  </Then>
                  <Else>
                    <AccountCircle style={{ marginRight: 5 }} />
                  </Else>
                </If>
                <span className={classes.profile__info}>
                  {profile.first_name} {profile.last_name}
                </span>
              </div>
            </Else>
          </If>
        </div>
      </AppBar>
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
        <Typography style={{ margin: 10 }}>
          <NextLink href="/profile">
            <a>Profile</a>
          </NextLink>
        </Typography>
        <Typography style={{ margin: 10, cursor: 'pointer' }}>
          <NextLink href="/settings">
            <a>Settings</a>
          </NextLink>
        </Typography>
        <Typography style={{ margin: 10, cursor: 'pointer' }} onClick={onLogout}>
          Logout
        </Typography>
      </Popover>
    </>
  )
}

export default Header
