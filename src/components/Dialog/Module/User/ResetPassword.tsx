import { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Grid } from '@material-ui/core'
import { DialogMain, FormControllerTextField, FormControllerPasswordField } from '@/components'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { commonStore, userStore } from '@/store/reducers'
import getPasswordYup from '@/utils/getPasswordYup'

function DialogResetPassword() {
  const validationSchema = useMemo(
    () =>
      yup.object({
        password: getPasswordYup('Password'),
        confirm_password: yup.string().oneOf([yup.ref('password'), null], 'Confirm password does not match')
      }),
    []
  )

  const resetPasswordForm = useForm({
    defaultValues: { password: '', confirm_password: '' },
    resolver: yupResolver(validationSchema)
  })

  const dispatch = useDispatch()
  const dialogState = useSelector(userStore.selectResetPwdDialog)

  useEffect(() => {
    if (!dialogState.open) {
      resetPasswordForm.reset()
    }
  }, [dialogState.open])

  const onResetPassword = resetPasswordForm.handleSubmit((data) => {
    dispatch(commonStore.actions.resetMessageState())
    dispatch(userStore.sagaResetPassword(data))
  })

  const onClose = () => {
    resetPasswordForm.reset()
    dispatch(userStore.actions.setResetPwdDialogOpen(false))
    dispatch(commonStore.actions.resetMessageState())
  }

  return (
    <DialogMain
      open={dialogState.open}
      title="Reset password"
      okText="Reset"
      onOk={onResetPassword}
      onClose={onClose}
      maxWidth="xs"
      loading={dialogState.loading}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControllerPasswordField
            style={{ marginTop: 8 }}
            type="password"
            required
            name="password"
            label="New password"
            control={resetPasswordForm.control}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControllerTextField
            type="password"
            required
            name="confirm_password"
            label="Confirm password"
            control={resetPasswordForm.control}
          />
        </Grid>
      </Grid>
    </DialogMain>
  )
}

export default DialogResetPassword
