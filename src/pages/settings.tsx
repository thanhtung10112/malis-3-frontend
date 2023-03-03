import { useEffect } from 'react'

import NextHead from 'next/head'
import { Grid, makeStyles } from '@material-ui/core'
import { AppBreadcrumb, FormControllerAutocomplete, DialogMain, AppAutocomplete } from '@/components'

import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'

import _ from 'lodash'
import { authStore } from '@/store/reducers'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SettingDetail } from '@/types/Auth'

const useStyles = makeStyles({
  dialog: {
    position: 'relative !important' as any,
    height: 'calc(100vh - 90px) !important'
  }
})

const SettingPage = () => {
  const classes = useStyles()

  const dispatch = useDispatch()
  const { initData, detail: settingDetail } = useSelector(authStore.selectSettings)

  const settingForm = useForm<SettingDetail>({
    shouldUnregister: false,
    resolver: yupResolver(
      yup.object({
        home_page: yup.number().nullable().required('Home page is required!'),
        default_language: yup.number().nullable().required('Default language is required!')
      })
    )
  })
  const watchTimezone = settingForm.watch('time_zone', '')

  const getTimezone = () => {
    const { time_zone } = settingForm.getValues()
    if (_.size(time_zone) === 0) {
      return null
    }
    return _.find(initData.timezones, { value: watchTimezone })
  }

  useEffect(() => {
    dispatch(authStore.sagaGetSettings())
  }, [])

  useEffect(() => {
    settingForm.reset(settingDetail)
  }, [settingDetail])

  const handleSaveSettings = settingForm.handleSubmit((formData) => {
    const payload = _.pick(formData, ['home_page', 'default_language', 'time_zone'])
    dispatch(authStore.sagaSaveSettings(payload))
  })

  return (
    <>
      <NextHead>
        <title>Settings Management</title>
      </NextHead>
      <AppBreadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'User Settings', href: '/settings' }
        ]}
      />
      <DialogMain
        open
        title="Settings"
        hideBackdrop
        height={350}
        draggable={false}
        PaperProps={{ elevation: 2 }}
        hideCloseButton
        okText="Save"
        onOk={handleSaveSettings}
        className={classes.dialog}
      >
        <Grid container spacing={2} style={{ marginTop: 8 }}>
          <Grid item xs={12}>
            <FormControllerAutocomplete
              disableClearable
              name="home_page"
              control={settingForm.control}
              options={initData.parameters.PAGES}
              label="Set default home-screen"
              renderOption={(option) => option.description}
              primaryKeyOption="value"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControllerAutocomplete
              disableClearable
              name="default_language"
              control={settingForm.control}
              options={initData.parameters.PLLA}
              label="Default Language"
              renderOption={(option) => option.description}
              primaryKeyOption="value"
            />
          </Grid>
          <Grid item xs={12}>
            <AppAutocomplete
              disableClearable
              disabled
              options={initData.timezones}
              label="Time Zone"
              renderOption={(option) => option.description}
              primaryKeyOption="value"
              value={getTimezone()}
            />
          </Grid>
        </Grid>
      </DialogMain>
    </>
  )
}

export const getServerSideProps = useAuthMiddleware()

export default SettingPage
