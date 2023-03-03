import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { Typography, Box } from '@material-ui/core'
import { DialogMain } from '@/components'

import { commonStore } from '@/store/reducers'

const DialogError = () => {
  const { t } = useTranslation('common')
  const dispatch = useDispatch()
  const errorLog = useSelector(commonStore.selectError)

  const handleClose = () => {
    dispatch(commonStore.actions.setOpenErrorDialog(false))
  }

  return (
    <DialogMain
      open={errorLog.open}
      title="Error!"
      type="error"
      closeText="OK"
      closeButtonProps={{ color: 'secondary' }}
      onClose={handleClose}
    >
      <Typography component={Box} paddingBottom={1} variant="body1">
        {t('error_message.500')}
      </Typography>
      <Typography variant="body2">StatusCode: {`${errorLog.statusCode} (${errorLog.message})`}</Typography>
    </DialogMain>
  )
}

export default DialogError
