import { useRouter } from 'next/router'

import { useSelector, useDispatch } from 'react-redux'

import { DialogMain } from '@/components/index'

import { authStore } from '@/store/reducers'

function SessionExpiredDialog() {
  const dispatch = useDispatch()
  const unauthorized = useSelector(authStore.selectUnauthorized)

  const router = useRouter()

  const onLogout = () => {
    dispatch(authStore.actions.logout())
    const isHomePage = router.pathname === '/'
    const originURL = encodeURIComponent(router.pathname)
    const directTo = isHomePage ? '/login' : `/login?next=${originURL}`
    router.push(directTo)
  }

  return (
    <DialogMain
      title="Unauthenticated"
      open={unauthorized}
      maxWidth="xs"
      description="You're unauthenticated, please try to login again"
      closable={false}
      onOk={onLogout}
      enterToOk={false}
    />
  )
}

export default SessionExpiredDialog
