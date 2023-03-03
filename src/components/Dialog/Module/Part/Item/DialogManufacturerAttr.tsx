import { DialogMain, TableExtendedProperties } from '@/components'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useForm, useFormContext } from 'react-hook-form'

import _ from 'lodash'
import { partStore } from '@/store/reducers'

import type { PartDetail } from '@/types/Part'

export type DialogManufacturerAttrProps = {
  open: boolean
  attributes: Record<string, any>
  onChange(attributes): void
  onClose(): void
}

const DialogManufacturerAttr: React.FC<DialogManufacturerAttrProps> = (props) => {
  const { open, attributes, onChange, onClose } = props

  const parameters = useSelector(partStore.selectParameters)

  const partForm = useFormContext<PartDetail>()
  const watchPartId = partForm.watch('id', null)

  const attributeForm = useForm({
    defaultValues: { additional_attributes: {} },
    shouldUnregister: false
  })

  useEffect(() => {
    attributeForm.setValue('additional_attributes', attributes || {})
  }, [attributes])

  const handleSaveAttr = () => {
    const { additional_attributes } = attributeForm.getValues()
    onChange(additional_attributes)
    handleClose()
  }

  const handleClose = () => {
    onClose()
    attributeForm.reset()
  }

  return (
    <DialogMain open={open} title="Attribute" okText="Save" onOk={handleSaveAttr} onClose={handleClose}>
      <TableExtendedProperties
        control={attributeForm.control}
        name="additional_attributes"
        editMode={!_.isNil(watchPartId)}
        propertiesList={parameters.MAAT}
        tableHeight={390}
        parameterName="MAAT"
      />
    </DialogMain>
  )
}

export default DialogManufacturerAttr
