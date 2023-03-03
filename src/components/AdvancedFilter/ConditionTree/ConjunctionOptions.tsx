import { Paper } from '@material-ui/core'

import clsx from 'clsx'

import useStyles from '../styles'

function ConjunctionOptions(props) {
  const classes = useStyles()
  const currentValue = props.value
  const disabled = props.disabled
  const conjunctionOptions = props.conjunctionOptions // take this from store

  const handleConjunctionChange = (value) => () => {
    props.onGroupConjunctionChange(value)
  }

  const menuItems = []
  let i = 0
  for (const conj of conjunctionOptions) {
    menuItems.push(
      <div
        className={clsx(classes.conjuction, conj.value === currentValue && 'active')}
        key={`${conj.value}-${i}`}
        onClick={handleConjunctionChange(conj.value)}
      >
        {conj.description}
      </div>
    )
    i++
  }

  return (
    <>
      <Paper elevation={1} className={clsx(classes.conjuctionRoot, disabled && classes.disabled)}>
        {menuItems}
      </Paper>
    </>
  )
}

export default ConjunctionOptions
