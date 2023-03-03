import React from 'react'

import { DialogMain } from '@/components/index'

import ConfirmContext from './ConfirmContext'

import { DEFAULT_OPTIONS } from './constant'
import { ConfirmationProps, ConfirmationOptions } from './type'

const buildOptions = (propsOptions, options) => {
  const dialogProps = {
    ...(propsOptions.dialogProps || DEFAULT_OPTIONS.dialogProps),
    ...(options.dialogProps || {})
  }

  return {
    ...DEFAULT_OPTIONS,
    ...propsOptions,
    ...options,
    dialogProps
  }
}

function ConfirmationProvider(props: ConfirmationProps) {
  const { children, propsOptions } = props

  const [options, setOptions] = React.useState({
    ...DEFAULT_OPTIONS,
    ...propsOptions
  })
  const [resolveReject, setResolveReject] = React.useState([])
  const [resolve] = resolveReject

  const confirm = React.useCallback((options = {} as Partial<ConfirmationOptions>) => {
    return new Promise((resolve, reject) => {
      setOptions(buildOptions(propsOptions, options))
      setResolveReject([resolve, reject])
    })
  }, [])

  const handleClose = React.useCallback(() => {
    setResolveReject([])
  }, [])

  const handleClickButton = React.useCallback(
    (action) => () => {
      resolve(action)
      handleClose()
    },
    [resolve, handleClose]
  )

  const mapButtonActions = options.buttons.map(({ action, ...buttonProps }) => ({
    ...buttonProps,
    onClick: handleClickButton(action)
  }))

  return (
    <>
      <ConfirmContext.Provider value={{ confirm, handleClose }}>{children}</ConfirmContext.Provider>
      <DialogMain
        {...options.dialogProps}
        type="warning"
        open={resolveReject.length === 2}
        title={options.title}
        description={options.description}
        extraButtons={mapButtonActions}
      />
    </>
  )
}

ConfirmationProvider.defaultProps = {
  propsOptions: {}
}

export default ConfirmationProvider
