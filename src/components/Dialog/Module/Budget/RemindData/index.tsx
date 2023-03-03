import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'

import parseHTML from 'html-react-parser'

import { budgetActions } from '@/store/reducers'

import { DialogMain } from '@/components'

function DialogRemindData() {
  const { t } = useTranslation('budget')

  const dispatch = useDispatch()
  const remindData = useSelector(budgetActions.selectRemindData)
  const helperText = React.useMemo(() => parseHTML(remindData.helpText), [remindData.helpText])

  const handleClose = () => {
    dispatch(budgetActions.setRemindData({ open: false }))
  }

  return (
    <DialogMain open={remindData.open} title={t('form.title.remind_data')} hideButtonsAction onClose={handleClose}>
      {helperText}
    </DialogMain>
  )
}

export default DialogRemindData
