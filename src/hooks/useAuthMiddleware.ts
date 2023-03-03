import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nookies from 'nookies'
import axios from 'axios'

import { StatusCode } from '@/utils/StatusCode'
import { GetServerSidePropsContext } from 'next'

const useAuthMiddleware =
  (locales: string[] = []) =>
  async (context: GetServerSidePropsContext) => {
    const cookies = nookies.get(context)
    const { resolvedUrl } = context
    try {
      await axios({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        method: 'GET',
        url: '/health_check/protected',
        headers: { Authorization: `Bearer ${cookies.token}` }
      })
    } catch (error) {
      if (error?.response?.status === StatusCode.UNAUTHORIZED) {
        nookies.destroy(context, 'token')
        nookies.destroy(context, 'redirect_to')
        nookies.destroy(context, 'current_job_id')
        const destination = resolvedUrl === '/' ? `/login` : `/login?back_url=${encodeURIComponent(resolvedUrl)}`
        return {
          redirect: {
            destination
          }
        }
      }
    }

    if (resolvedUrl === '/' && cookies.redirect_to) {
      return {
        redirect: {
          destination: cookies.redirect_to
        }
      }
    }
    return {
      props: {
        ...(await serverSideTranslations(context.locale, locales))
      }
    }
  }

export default useAuthMiddleware
