import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { exportProcessDialogActions, makeAListActions } from '@/store/reducers'

import { CheckCircleRounded, HighlightOffOutlined } from '@material-ui/icons'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Button,
  CircularProgress
} from '@material-ui/core'

import { DialogMain } from '@/components/index'
import { Case, Default, Switch } from 'react-if'

import type { ExtraButton } from '@/components/Dialog/Main/type'

function ExportProgressDialog() {
  const dispatch = useDispatch()

  const sseConnection = useRef(null)

  const domain = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/'

  const isOpen = useSelector((state: any) => state.exportProcessDialog.isOpen)
  const message = useSelector((state: any) => state.exportProcessDialog.message)
  const operationId = useSelector((state: any) => state.exportProcessDialog.operationId)
  const status = useSelector((state: any) => state.exportProcessDialog.status)

  const celeryId = useSelector((state: any) => state.exportProcessDialog.celeryId)

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const backgroundJobListener = (event) => {
    const data = JSON.parse(event.data)
    dispatch(exportProcessDialogActions.setMessage(data.message))
    dispatch(exportProcessDialogActions.setStatus(data.status))

    if (data.status === 'SUCCESS') {
      sseConnection.current.removeEventListener(operationId, backgroundJobListener)
      const redirectUrl = `${domain}make_a_list/get_result?operation_id=${operationId}&destination=${
        data.destination
      }&t=${Date.now()}`
      window.open(redirectUrl)
      setConfirmDialogOpen(false)
      dispatch(exportProcessDialogActions.setOpen(false))
    } else if (data.status === 'ERROR') {
      setConfirmDialogOpen(false)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      dispatch(exportProcessDialogActions.resetInitState())
      if (sseConnection.current) {
        sseConnection.current.close()
        sseConnection.current = null
      }
    } else {
      if (!sseConnection.current) {
        sseConnection.current = new EventSource(`${domain}background_stream`)
      }
      sseConnection.current.addEventListener(operationId, backgroundJobListener)
    }
  }, [isOpen])

  const cancelOperation = () => {
    setConfirmDialogOpen(true)
  }

  const handleCancelOperation = () => {
    dispatch(makeAListActions.stopMakeAList({ celery_id: celeryId }))
    setConfirmDialogOpen(false)
    dispatch(exportProcessDialogActions.setOpen(false))
  }

  const closeDialog = () => {
    dispatch(exportProcessDialogActions.setOpen(false))
  }

  const renderButton: ExtraButton = {
    label: status === 'SUCCESS' || status === 'ERROR' ? 'Close' : 'Cancel',
    onClick: status === 'SUCCESS' || status === 'ERROR' ? closeDialog : cancelOperation
  }

  const SimpleConfirmationDialog = () => {
    return (
      <Dialog
        open
        // onClose={()=>{}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm canceling exporting progress</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to cancel the exporting progress?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelOperation} color="primary">
            Yes
          </Button>
          <Button onClick={() => setConfirmDialogOpen(false)}>No</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <>
      <DialogMain
        open={isOpen}
        maxWidth="xs"
        fullWidth
        extraButtons={renderButton}
        bodyStyles={{ margin: 'auto', textAlign: 'center' }}
      >
        <Switch>
          <Case condition={status === 'SUCCESS'}>
            <CheckCircleRounded fontSize="large" style={{ marginTop: '1rem' }} />
          </Case>
          <Case condition={status === 'ERROR'}>
            <HighlightOffOutlined fontSize="large" style={{ marginTop: '1rem' }} />
          </Case>
          <Default>
            <CircularProgress style={{ marginTop: '1rem' }} />
          </Default>
        </Switch>

        <Typography variant="body1" style={{ marginTop: '1rem' }}>
          {message}
        </Typography>
      </DialogMain>

      {confirmDialogOpen ? SimpleConfirmationDialog() : ''}
    </>
  )
}

export default ExportProgressDialog
