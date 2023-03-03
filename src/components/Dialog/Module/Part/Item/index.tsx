import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'next-i18next'

import {
  DialogMain,
  FormControllerTabs,
  BtnHelp,
  useConfirm,
  TableExtendedProperties,
  AppTabHistoryLog
} from '@/components'
import TabGeneral from './TabGeneral'
import TabStandard from './TabStandard'
import TabManufacturer from './TabManufacturer'
import TabParent from './TabParent'
import Context from '../Context'

import _ from 'lodash'
import getValidationSchema from './validationSchema'
import { yupResolver } from '@hookform/resolvers/yup'
import { partStore } from '@/store/reducers'

import type { ItemDetail } from '@/types/Item'
import type { DataForDropdown, HistoryLog } from '@/types/Common'
import type { DialogPartProps } from '../type'

const DialogItem: React.FC<DialogPartProps> = (props) => {
  const { permissions, loading, tab, wiki_page, detail, historyLogs, onSubmit, onClose, onChangeTab } = props

  const { t } = useTranslation('item')
  const { confirm } = useConfirm()

  const isCreating = useMemo(() => _.isNil(detail.id), [detail])
  const validationSchema = useMemo(() => getValidationSchema(t), [])

  const itemForm = useForm<ItemDetail>({
    shouldUnregister: false,
    resolver: yupResolver(validationSchema)
  })

  const dispatch = useDispatch()
  const confirmRef = useSelector(partStore.selectConfirmRef)
  const parameters = useSelector(partStore.selectParameters)

  useEffect(() => {
    itemForm.reset(detail as ItemDetail)
  }, [detail])

  useEffect(() => {
    if (confirmRef.open) {
      handleConfirmRef()
    }
  }, [confirmRef.open])

  const handleConfirmRef = async () => {
    const result = await confirm({
      title: 'Warning',
      description: confirmRef.message,
      buttons: [{ label: 'Ok', action: 'OK' }]
    })
    if (result === 'OK') {
      dispatch(partStore.actions.setConfirmRefOpen(false))
    }
  }

  const handleChangeHistoryLogs = (data: HistoryLog[]) => {
    dispatch(partStore.actions.setHistoryLogs(data))
  }

  const handleSubmitForm = itemForm.handleSubmit((formData) => {
    formData.material_equiv = (formData.material_equiv as DataForDropdown)?.value || null
    formData.manufacturer_equiv = (formData.manufacturer_equiv as DataForDropdown)?.value || null

    formData.drawing_id = (formData.drawing_id as DataForDropdown)?.value || null

    formData.reference_to = (formData.reference_to as DataForDropdown)?.value || null

    const data = _.pick(formData, [
      'descriptions',
      'dpn',
      'drawing_id',
      'job_id',
      'manufacturer_equiv',
      'manufacturers',
      'mass',
      'material_equiv',
      'reference_to',
      'unit',
      'additional_attributes'
    ])
    // remove desc attribute from manufacturer list
    data.manufacturers = _.map(data.manufacturers, (manu) => _.omit(manu, 'description'))
    onSubmit(formData.id, data)
  })

  const generalTab = {
    label: t('common:tab.general'),
    panel: <TabGeneral />,
    errorKey: ['dpn', 'drawing_id', 'mass']
  }

  const standardTab = {
    label: t('form.tab.standard'),
    panel: <TabStandard />,
    errorKey: ['manufacturer_equiv', 'material_equiv']
  }

  const manufacturerTab = {
    label: t('form.tab.manufacturer'),
    panel: <TabManufacturer />
  }

  const parentTab = {
    label: t('form.tab.parent'),
    hide: isCreating,
    panel: <TabParent />
  }

  const historyTab = {
    label: t('common:tab.history'),
    hide: isCreating,
    panel: (
      <AppTabHistoryLog
        data={historyLogs}
        entityId={detail.id}
        mode="horizonatal"
        tableHeight={320}
        descriptionRows={19}
        entity="item"
        onChange={handleChangeHistoryLogs}
      />
    )
  }

  const extendedPropTab = {
    label: t('common:tab.extended_properties'),
    panel: (
      <TableExtendedProperties
        control={itemForm.control}
        name="additional_attributes"
        editMode={!isCreating}
        propertiesList={parameters.PAAT}
        tableHeight={325}
        parameterName="PAAT"
      />
    )
  }

  const tabs = [generalTab, standardTab, manufacturerTab, parentTab, extendedPropTab, historyTab]

  return (
    <DialogMain
      open
      loading={loading}
      fullWidth
      maxWidth="md"
      title={
        <BtnHelp title={isCreating ? t('form.title.create_item') : t('form.title.update_item')} href={wiki_page} />
      }
      onOk={handleSubmitForm}
      onClose={onClose}
      height={400}
      okText={isCreating ? t('common:button.create') : t('common:button.update')}
      okButtonProps={{ disabled: (!permissions?.edit && !isCreating) || loading }}
    >
      <Context.Provider value={{ loading }}>
        <FormControllerTabs value={tab} onChange={onChangeTab} form={itemForm} tabs={tabs} />
      </Context.Provider>
    </DialogMain>
  )
}

export default DialogItem
