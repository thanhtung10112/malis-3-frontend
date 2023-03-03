import useStyles from '@/styles/page/layout'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'

function IndexPage() {
  const classes = useStyles()

  return (
    <>
      <main className={classes.main} />
    </>
  )
}

export const getServerSideProps = useAuthMiddleware()

export default IndexPage
