import useStyles from './styles'

function AppTitle({ label, ...rest }) {
  const classes = useStyles()

  return (
    <div className={classes.root} {...rest}>
      {/* <div className={classes.rectangle} style={{ backgroundColor: bgColor }} /> */}
      <div className={classes.label}>{label}</div>
    </div>
  )
}

export default AppTitle
