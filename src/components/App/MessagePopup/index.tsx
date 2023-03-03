import { useSelector, useDispatch } from 'react-redux'

import { Snackbar } from '@material-ui/core'

import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'

import { commonStore } from '@/store/reducers'

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const AppMessagePopup: React.FC = () => {
  const dispatch = useDispatch()

  const messageState = useSelector(commonStore.selectMessageState)

  const handleClose = () => {
    dispatch(commonStore.actions.setDisplayMessage(false))
  }

  return (
    <Snackbar
      open={messageState.display}
      message={messageState.message}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={messageState.status}>
        {messageState.message}
      </Alert>
    </Snackbar>
  )
}

export default AppMessagePopup
