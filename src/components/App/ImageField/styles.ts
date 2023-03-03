import { makeStyles } from '@material-ui/core'

export default makeStyles((theme) => ({
  upload: {
    width: (props: any) => props.width,
    height: (props: any) => props.height,
    textAlign: 'center',
    verticalAlign: 'top',
    backgroundColor: '#fafafa',
    border: '1px dashed #d9d9d9',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'border-color 0.3s',
    '&.error': {
      border: `1px solid ${theme.palette.error.main}`
    }
  },
  uploadSelect: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  uploadSelect__icon: {
    display: 'inline-block',
    color: 'inherit',
    fontStyle: 'normal',
    lineHeight: 0,
    textAlign: 'center',
    textTransform: 'none',
    verticalAlign: '-0.125em',
    fontSize: '2em'
  },
  uploadSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
  },
  imageSection: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  imageSection__image: {
    width: '100%',
    height: '100%'
  },
  imageSection__actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    width: '100%',
    height: '100%',
    color: 'white',
    opacity: '0',
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.standard,
      easing: 'ease-out'
    }),
    '&:hover': {
      opacity: 1
    }
  },
  imageSection__actions__item: {
    '&:first-child': {
      marginRight: theme.spacing(1)
    },
    color: 'rgba(255, 255, 255, 0.85)',
    '&:hover': {
      color: 'white'
    }
  },
  imageSection__loadingOverlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    width: '100%',
    height: '100%',
    color: 'white'
  }
}))
