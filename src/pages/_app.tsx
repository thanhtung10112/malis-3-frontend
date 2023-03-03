import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useBeforeUnload } from 'react-use'
import { useRouter } from 'next/router'

import Rollbar from 'rollbar'
import NextNprogress from 'nextjs-progressbar'

import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'

import { Provider as RollbarProvider } from '@rollbar/react'

import { appWithTranslation } from 'next-i18next'

import {
  Header,
  AppLoadingPage,
  AppMessagePopup,
  SummaryReport,
  SessionExpiredDialog,
  ConfirmProvider,
  ErrorBoundary,
  DialogError
} from '@/components'

import { Unless } from 'react-if'
import DateFnsUtils from '@date-io/date-fns'
import { wrapper } from '@/store/config'

import theme from '@/styles/theme'
import _ from 'lodash'
import { commonStore, authStore } from '@/store/reducers'

import type { AppProps } from 'next/app'

import '@/styles/theme.css'

const rollbarConfig = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NEXT_PUBLIC_MODE,
  enabled: process.env.NEXT_PUBLIC_MODE === 'production'
}

const rollbar = new Rollbar(rollbarConfig)

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const dispatch = useDispatch()

  const isLoginPage = router.pathname === '/login'
  const editRows = useSelector(commonStore.selectEditRows)
  const profile = useSelector(authStore.selectProfile)
  const currentLanguage = useSelector(commonStore.selectCurrentLanguage)

  useBeforeUnload(editRows.length > 0, 'You have unsaved changes, are you sure?')

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  useEffect(() => {
    return () => {
      dispatch(commonStore.resetState())
    }
  }, [router.pathname])

  useEffect(() => {
    if (_.isNil(currentLanguage.id) && !_.isNil(profile.default_language_id)) {
      dispatch(
        commonStore.actions.setCurrentLanguage({
          ...commonStore.initialState.currentLanguage,
          id: profile.default_language_id
        })
      )
    }
  }, [profile, currentLanguage])

  return (
    <>
      <ThemeProvider theme={theme}>
        <NextNprogress color="#29D" startPosition={0.3} stopDelayMs={200} height={2} options={{ showSpinner: false }} />
        <CssBaseline />

        <AppMessagePopup />
        <AppLoadingPage />

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <ConfirmProvider>
            <RollbarProvider instance={rollbar}>
              <ErrorBoundary>
                <Unless condition={isLoginPage}>
                  <Header />
                </Unless>

                <Component {...pageProps} />
              </ErrorBoundary>
              <DialogError />
            </RollbarProvider>
          </ConfirmProvider>

          <SessionExpiredDialog />
          <SummaryReport />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </>
  )
}
export default wrapper.withRedux(appWithTranslation(MyApp))
