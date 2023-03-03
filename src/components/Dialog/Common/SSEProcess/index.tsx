import React from 'react'

import { CircularProgress, Typography } from '@material-ui/core'

import { CheckCircleRounded, HighlightOffOutlined } from '@material-ui/icons'

import { Case, Default, Switch } from 'react-if'

import { DialogMain, useConfirm } from '@/components/index'

import { useDispatch } from 'react-redux'
import useSSE from '@/hooks/useSSE'

import _ from 'lodash'
import { commonStore } from '@/store/reducers'

import type { DialogSSEProcessProps } from './type'

function DialogSSEProcess(props: DialogSSEProcessProps) {
  const { open, operationId, onClose, onSuccess, onError } = props
  const { dataSSE, setDataSSE } = useSSE(operationId)
  const { confirm, handleClose: handleCloseConfirm } = useConfirm()

  const dispatch = useDispatch()

  const isCompleted = React.useMemo(() => dataSSE.status === 'SUCCESS' || dataSSE.status === 'ERROR', [dataSSE.status])

  React.useEffect(() => {
    if (isCompleted) {
      handleCloseConfirm()
      onClose()
      if (_.isFunction(onSuccess) && dataSSE.status === 'SUCCESS') {
        onSuccess(operationId, dataSSE)
      }
      if (_.isFunction(onError) && dataSSE.status === 'ERROR') {
        onError(operationId, dataSSE)
      }
    }
  }, [isCompleted])

  /**
   * This hook to reset state if open = false
   */
  React.useEffect(() => {
    if (!open) {
      setDataSSE({
        message: 'Initializing...',
        status: null,
        operation_result: null
      })
    }
  }, [open])

  const handleCancelProcess = async () => {
    const result = await confirm({
      title: 'Confirm canceling exporting progress',
      description: 'The progress is not completed yet. Are you sure you want to cancel?'
    })
    if (result === 'OK') {
      onClose()
      dispatch(commonStore.sagaCancelBackgroundJob(operationId))
    }
  }

  return (
    <DialogMain
      open={open}
      onClose={isCompleted ? onClose : handleCancelProcess}
      maxWidth="xs"
      fullWidth
      bodyStyles={{ margin: 'auto', textAlign: 'center' }}
      closeText={isCompleted ? 'Close' : 'Cancel'}
    >
      <Switch>
        <Case condition={dataSSE.status === 'SUCCESS'}>
          <CheckCircleRounded fontSize="large" style={{ marginTop: '1rem' }} />
        </Case>
        <Case condition={dataSSE.status === 'ERROR'}>
          <HighlightOffOutlined fontSize="large" style={{ marginTop: '1rem' }} />
        </Case>
        <Default>
          <CircularProgress style={{ marginTop: '1rem' }} />
        </Default>
      </Switch>

      <Typography variant="body1" style={{ marginTop: '1rem' }}>
        {dataSSE.message}
      </Typography>
    </DialogMain>
  )
}

export default DialogSSEProcess
