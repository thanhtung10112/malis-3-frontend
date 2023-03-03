import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'

import { AppAutocompleteAsync, DialogMain } from '@/components'

import { partStore } from '@/store/reducers'

import type { DialogMainProps } from '@/components/Dialog/Main/type'
import type { DataForDropdown } from '@/types/Common'

export type DialogCopyItemProps = Pick<DialogMainProps, 'open' | 'onClose'>

const DialogCopyItem: React.FC<DialogCopyItemProps> = (props) => {
  const { open, onClose } = props

  const { t } = useTranslation('item')

  const [itemSelected, setItemSelected] = useState<DataForDropdown>({
    value: null,
    entity_id: '',
    description: ''
  })

  // when close this dialog, then reset itemSelected
  useEffect(() => {
    if (!open) {
      setItemSelected({
        value: null,
        entity_id: '',
        description: ''
      })
    }
  }, [open])

  const dispatch = useDispatch()

  const handleOk = (event) => {
    dispatch(partStore.sagaGetItemCopy(itemSelected))
    onClose(event)
  }

  /**
   * @param {DataForDropdown} optionValue
   */
  const handleSelectItem = (event, optionValue: DataForDropdown) => {
    setItemSelected(optionValue)
  }

  return (
    <DialogMain
      title={t('form.title.copy_attribute')}
      open={open}
      onOk={handleOk}
      onClose={onClose}
      okText={t('common:button.save')}
    >
      <AppAutocompleteAsync style={{ marginTop: 4 }} label="Part #" compName="part_list" onChange={handleSelectItem} />
    </DialogMain>
  )
}

export default DialogCopyItem
