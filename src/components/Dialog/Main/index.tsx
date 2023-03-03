import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Button,
  Tooltip,
  LinearProgress,
  Paper,
  useTheme
} from '@material-ui/core'

import Draggable from 'react-draggable'

import CloseIcon from '@material-ui/icons/Close'
import CheckCircleRounded from '@material-ui/icons/CheckCircleRounded'
import InfoIcon from '@material-ui/icons/Info'
import WarningIcon from '@material-ui/icons/Warning'
import ErrorIcon from '@material-ui/icons/Error'

import { Unless, When } from 'react-if'

import useStyles from './styles'

import _ from 'lodash'
import clsx from 'clsx'

import type { DialogMainProps, ExtraButton } from './type'

function PaperComponent({ draggable, ...props }) {
  return (
    <>
      <When condition={draggable}>
        <Draggable handle=".MuiDialogTitle-root" cancel={'[class*="MuiDialogContent-root"]'} bounds="parent">
          <Paper {...props} style={{ margin: 0 }} />
        </Draggable>
      </When>
      <Unless condition={draggable}>
        <Paper {...props} style={{ margin: 0 }} />
      </Unless>
    </>
  )
}

function DialogMain(props: DialogMainProps) {
  const {
    title,
    closable,
    onClose,
    onOk,
    description,
    children,
    extraButtons,
    okText,
    closeText,
    className,
    closeButtonProps,
    okButtonProps,
    loading,
    enterToOk,
    bodyStyles,
    hideCloseButton,
    hideOkButton,
    hideButtonsAction,
    type,
    draggable,
    PaperProps,
    classes: classesDialog,
    ...dialogProps
  } = props

  const theme = useTheme()
  const classes = useStyles(props)

  const renderButtons = React.useCallback(() => {
    if (_.isArray(extraButtons)) {
      return (extraButtons as ExtraButton[])
        .filter((button) => !button.hide)
        .map(({ label, hide, ...buttonProps }, index) => (
          <Button disabled={loading} {...buttonProps} key={index}>
            {label}
          </Button>
        ))
    }
    return (
      <Button disabled={loading} {...extraButtons}>
        {extraButtons?.label}
      </Button>
    )
  }, [extraButtons])

  const getColorType = (type) => theme.palette[type].main
  const iconList = React.useMemo(
    () => ({
      success: CheckCircleRounded,
      error: ErrorIcon,
      warning: WarningIcon,
      info: InfoIcon
    }),
    []
  )

  const renderTitle = React.useCallback(() => {
    if (type === 'normal') {
      return title
    }
    const color = getColorType(type)
    const Icon = iconList[type]
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon style={{ marginRight: 8, color }} />
        <div>{title}</div>
      </div>
    )
  }, [title, type])

  /*
  React.useEffect(() => {
    const listener = (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault()
        if (enterToOk && _.isFunction(onOk)) {
          onOk()
        }
      }
    }
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [onOk])
  */

  return (
    <Dialog
      {...dialogProps}
      className={clsx(classes.root, className)}
      PaperComponent={PaperComponent}
      PaperProps={{ draggable, ...PaperProps } as any}
      classes={{ paper: classes.paperRoot, ...classesDialog }}
    >
      <When condition={Boolean(title)}>
        <DialogTitle className={classes.title}>{renderTitle()}</DialogTitle>
      </When>

      <When condition={loading}>
        <LinearProgress className={classes.progress} />
      </When>

      <When condition={closable && _.isFunction(onClose)}>
        <Tooltip title="Click to close dialog">
          <CloseIcon className={clsx(classes.closeIcon, { disabled: loading })} onClick={onClose as any} />
        </Tooltip>
      </When>

      <When condition={description}>
        <DialogContent className={classes.content} style={{ ...bodyStyles }}>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      </When>
      <Unless condition={description}>
        <DialogContent className={classes.content} style={{ ...bodyStyles }}>
          {children}
        </DialogContent>
      </Unless>

      <Unless condition={hideButtonsAction}>
        <DialogActions className={classes.buttonActions}>
          <When condition={_.isNil(extraButtons)}>
            <When condition={_.isFunction(onOk) && !hideOkButton}>
              <Button color="primary" disabled={loading} onClick={onOk} {...okButtonProps}>
                {okText}
              </Button>
            </When>

            <When condition={_.isFunction(onClose) && !hideCloseButton}>
              <Button disabled={loading} onClick={onClose} {...closeButtonProps}>
                {closeText}
              </Button>
            </When>
          </When>
          <Unless condition={_.isNil(extraButtons)}>{renderButtons()}</Unless>
        </DialogActions>
      </Unless>
    </Dialog>
  )
}

DialogMain.defaultProps = {
  closeText: 'close',
  okText: 'ok',
  closable: true,
  maxWidth: 'sm',
  enterToOk: false,
  hideOkButton: false,
  hideCloseButton: false,
  hideButtonsAction: false,
  type: 'normal',
  draggable: true
}

export default DialogMain
