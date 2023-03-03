import { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'

import NextHead from 'next/head'

import { Grid, Typography, TextField, makeStyles } from '@material-ui/core'
import {
  AppTitle,
  DialogMain,
  FormControllerTextField,
  AppBreadcrumb,
  FormControllerPasswordField,
  AppImageField
} from '@/components'

import clsx from 'clsx'
import _ from 'lodash'
import { authStore } from '@/store/reducers'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import getPasswordYup from '@/utils/getPasswordYup'

const centerElement = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const useStyles = makeStyles((theme) => {
  return {
    root: {
      height: 'calc(100vh - 48px - 44px)'
    },
    wrap: {
      height: '100%',
      ...centerElement
    },
    content: {
      height: 480,
      width: 980,
      backgroundColor: '#F4F7FC',
      padding: theme.spacing(3),
      boxShadow: theme.shadows[1]
    },
    avatar: {
      ...centerElement,
      width: 132,
      height: 132,
      border: '3px dotted #e5e5e5',
      backgroundColor: 'white',
      '& .icon': {
        fontSize: 32,
        color: '#0A65FF'
      }
    },
    contact: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    infoRoot: {
      height: 'calc(100% - 132px - 25px)',
      marginTop: theme.spacing(2),
      backgroundColor: 'white'
    },
    infoItem: {
      padding: theme.spacing(2, 2, 0, 2)
    },
    personalInfo: {
      borderRight: '1px solid #e5e5e5'
    },
    textField: {
      margin: 10,
      marginLeft: 0
    },
    timezones: {
      marginTop: theme.spacing(1)
    },
    changePassword: {
      cursor: 'pointer',
      opacity: 0.6,
      '&:hover': {
        opacity: 1,
        textDecoration: 'underline'
      }
    }
  }
})

const getValidationSchema = () =>
  yup.object({
    new_password: getPasswordYup('New password'),
    old_password: yup.string().required('Old password is required!'),
    confirm_password: yup
      .string()
      .oneOf([yup.ref('new_password'), null], 'Confirm password does not match with old password!')
  })

const ProfilePage = () => {
  const classes = useStyles()

  const validationSchema = useMemo(getValidationSchema, [])

  const passwordForm = useForm({
    defaultValues: {
      new_password: '',
      old_password: '',
      confirm_password: ''
    },
    shouldUnregister: false,
    resolver: yupResolver(validationSchema)
  })

  const dispatch = useDispatch()
  const profile = useSelector(authStore.selectProfile)
  const pwdDialogState = useSelector(authStore.selectPwdDialogState)

  const groupMember = useMemo(() => {
    const { group_membership } = profile
    return group_membership.reduce((preVal, currentVal) => {
      const groupTransform = `- ${currentVal.group_id} - ${currentVal.description}\n`
      return preVal + groupTransform
    }, '')
  }, [profile.group_membership])

  useEffect(() => {
    if (!pwdDialogState.open) {
      passwordForm.reset()
    }
  }, [pwdDialogState.open])

  const handleChangePassword = passwordForm.handleSubmit((formData) => {
    const data = _.omit(formData, 'confirm_password')
    dispatch(authStore.sagaChangePassword(data))
  })

  const handleOpenDialog = () => {
    dispatch(authStore.actions.setPwDialogState({ open: true }))
  }

  const handleCloseDialog = () => {
    dispatch(authStore.actions.setPwDialogState({ open: false }))
    passwordForm.reset()
  }

  const handleChangeProfile = (file) => {
    dispatch(authStore.actions.setProfileAvatar(file.base64))
  }

  return (
    <>
      <NextHead>
        <title>Profile Management</title>
      </NextHead>
      <AppBreadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'User Profile', href: '/profile' }
        ]}
      />
      <div className={classes.root}>
        <div className={classes.wrap}>
          <div className={classes.content}>
            <Grid container className="body">
              <Grid item xs={2}>
                <AppImageField
                  width={128}
                  height={128}
                  image={profile.avatar}
                  httpRequest={{
                    method: 'put',
                    key: 'avatar',
                    endpoint: 'profile'
                  }}
                  onChange={handleChangeProfile}
                />
              </Grid>
              <Grid item xs={10} className={classes.contact}>
                <Typography variant="h6" style={{ marginBottom: 12 }}>
                  {`${profile.first_name} ${profile.last_name}`}
                </Typography>
                <Typography variant="body1">
                  Your personal information is disabled here. Please contact the Human Resource department to change
                  your personal information.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={classes.infoRoot}>
              <Grid item xs={6} className={clsx(classes.infoItem, classes.personalInfo)}>
                <AppTitle label="Personal infomation" />
                <TextField label="Email" value={profile.email} className={classes.textField} disabled />
                <TextField label="Valid Until" value={profile.valid_until} className={classes.textField} disabled />
              </Grid>
              <Grid item xs={6} className={classes.infoItem}>
                <AppTitle label="Sign in & Security" />
                <TextField label="Username" value={profile.user_name} className={classes.textField} disabled />
                <div onClick={handleOpenDialog} className={clsx(classes.textField, classes.changePassword)}>
                  Change password
                </div>
                <TextField
                  label="Group"
                  value={groupMember}
                  multiline
                  rows={5}
                  className={classes.textField}
                  disabled
                />
              </Grid>
            </Grid>
            <Typography variant="body1" className={classes.timezones}>
              Last Modified: {profile.updated_at}
            </Typography>
          </div>
        </div>
      </div>
      <DialogMain
        title="Change Password"
        open={pwdDialogState.open}
        loading={pwdDialogState.loading}
        closeText="Cancel"
        onOk={handleChangePassword}
        onClose={handleCloseDialog}
      >
        <Grid container spacing={2} style={{ marginTop: 2 }}>
          <Grid item xs={12}>
            <FormControllerTextField
              control={passwordForm.control}
              name="old_password"
              label="Old password"
              type="password"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControllerPasswordField
              control={passwordForm.control}
              name="new_password"
              label="New password"
              type="password"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControllerTextField
              control={passwordForm.control}
              name="confirm_password"
              label="Confirm password"
              type="password"
              required
            />
          </Grid>
        </Grid>
      </DialogMain>
    </>
  )
}

export const getServerSideProps = useAuthMiddleware()

export default ProfilePage
