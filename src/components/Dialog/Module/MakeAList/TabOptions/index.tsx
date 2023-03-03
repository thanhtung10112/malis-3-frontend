import { FormControlLabel, Switch, Tooltip } from '@material-ui/core'

import { useTranslation } from 'next-i18next'
import useStyles from './styles'
import { useFormContext } from 'react-hook-form'
import { useConfirm } from '@/components/index'

function TabOptions() {
  const classes = useStyles()
  const { t } = useTranslation('make_a_list')
  const { confirm } = useConfirm()
  const makeAListForm = useFormContext()

  const watchIgnoreCase = makeAListForm.watch('ignore_case', false)
  const watchDistinct = makeAListForm.watch('distinct', false)

  const onToggleOption = (event, checked) => {
    const { name } = event.target
    makeAListForm.setValue(name, checked)
    if (name === 'distinct' && checked === true) {
      confirm({
        title: t('common:label.warning'),
        description: t('message.distinct_warning'),
        buttons: [
          {
            label: 'OK',
            action: 'ok'
          }
        ]
      })
    }
  }
  return (
    <>
      <FormControlLabel
        control={<Switch name="ignore_case" checked={watchIgnoreCase} onChange={onToggleOption} color="primary" />}
        label={
          <>
            <span>{t('label.ignore_case')}</span>
            <Tooltip title={t('tooltip.ignore_case')}>
              <span className={classes.infoOptionTab}>(?)</span>
            </Tooltip>
          </>
        }
      />
      <p />

      <FormControlLabel
        control={<Switch name="distinct" checked={watchDistinct} onChange={onToggleOption} color="primary" />}
        label={
          <>
            <span>{t('label.distinct')}</span>
            <Tooltip title={t('tooltip.distinct')}>
              <span className={classes.infoOptionTab}>(?)</span>
            </Tooltip>
          </>
        }
      />
    </>
  )
}

export default TabOptions
