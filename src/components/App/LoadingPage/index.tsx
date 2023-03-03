import { useSelector } from 'react-redux'

import { Backdrop, CircularProgress } from '@material-ui/core'

import { commonStore } from '@/store/reducers'

const AppLoadingPage: React.FC = () => {
  const loading = useSelector(commonStore.selectLoading)

  return (
    <div>
      <Backdrop style={{ zIndex: 10000, color: '#fff' }} open={loading.page}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

export default AppLoadingPage
