import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import useStyles from '@/styles/page/login'

import Head from 'next/head'

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Container,
  LinearProgress
} from '@material-ui/core'

import { Lock as LockIcon } from '@material-ui/icons'

import { When } from 'react-if'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { commonStore, authStore } from '@/store/reducers'

import type { LoginData } from '@/types/Auth'

function Login() {
  const classes = useStyles()

  const dispatch = useDispatch()
  const authencationState = useSelector(authStore.selectState)
  const messageState = useSelector(commonStore.selectMessageState)

  const defaultData = {
    user_id: '',
    password: '',
    remember: true
  }

  const validationSchema = yup.object({
    user_id: yup.string().required('User is required'),
    password: yup.string().required('Password is required')
  })

  const resolver = yupResolver<LoginData>(validationSchema)
  const loginForm = useForm<LoginData>({
    resolver,
    shouldUnregister: false,
    defaultValues: { ...defaultData }
  })

  useEffect(() => {
    if (authencationState.access_token) {
      loginForm.clearErrors()
    }
  }, [authencationState])

  const onLogin = loginForm.handleSubmit((data) => {
    dispatch(authStore.sagaLogin(data))
    dispatch(commonStore.actions.setDisplayMessage(false))
  })

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <Container component="main" maxWidth="xs" className={classes.wrapLogin}>
        <CssBaseline />
        <div className={classes.loginForm} role="login-form">
          <When condition={authencationState.loading}>
            <LinearProgress className={classes.progress} />
          </When>
          <Avatar className={classes.topIcon}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className={classes.loginTitle} role="heading">
            Sign in
          </Typography>
          <form onSubmit={onLogin} role="form">
            <When condition={messageState.display}>
              <div role="alert" className={classes.error}>
                {messageState.message}
              </div>
            </When>
            <TextField
              required
              className={classes.textField}
              label="Username"
              name="user_id"
              role="input"
              inputProps={{
                'aria-label': 'user_id'
              }}
              inputRef={loginForm.register}
              error={Boolean(loginForm.errors.user_id)}
              helperText={loginForm.errors.user_id?.message}
            />

            <TextField
              required
              type="password"
              className={classes.textField}
              label="Password"
              name="password"
              role="input"
              inputProps={{
                'aria-label': 'password'
              }}
              error={Boolean(loginForm.errors.password)}
              helperText={loginForm.errors.password?.message}
              inputRef={loginForm.register}
            />

            <Controller
              name="remember"
              control={loginForm.control}
              render={({ onChange, ...props }) => {
                const remember = loginForm.watch('remember')
                return (
                  <FormControlLabel
                    {...props}
                    className={classes.checkbox}
                    label="Remember"
                    onChange={(_, checked) => {
                      onChange(checked)
                    }}
                    checked={remember}
                    control={<Checkbox inputProps={{ 'aria-label': 'remember' }} />}
                  />
                )
              }}
            />

            <div className={classes.wrapButton}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submitButton}
                disableElevation
                role="button"
                aria-pressed="true"
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </>
  )
}

export async function getServerSideProps(context) {
  const { req } = context
  const { token } = req.cookies
  if (token) {
    return {
      redirect: {
        destination: '/'
      }
    }
  }
  return {
    props: {
      namespacesRequired: ['common']
    }
  }
}

export default Login
