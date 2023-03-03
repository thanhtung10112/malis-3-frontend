import { makeStyles } from '@material-ui/core/styles'

import { FOOTER } from '@/styles/vars/size'

const useStyles = makeStyles(() => {
  return {
    footer: {
      height: FOOTER,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      fontSize: 10,
      fontWeight: 500
    }
  }
})

export default useStyles
