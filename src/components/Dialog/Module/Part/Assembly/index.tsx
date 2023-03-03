import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'

import { DialogMain, FormControllerTabs, BtnHelp, TableExtendedProperties, AppTabHistoryLog } from '@/components'

import TabGeneral from './TabGeneral'
import TabManufacturer from '../Item/TabManufacturer'
import TabComponent from './TabComponent'
import TabParent from '../Item/TabParent'
import Context from '../Context'

import _ from 'lodash'
import getValidationSchema from './validationSchema'
import { yupResolver } from '@hookform/resolvers/yup'
import { partStore } from '@/store/reducers'

import type { AssemblyDetail } from '@/types/Assembly'
import type { DataForDropdown, HistoryLog } from '@/types/Common'
import type { DialogPartProps } from '../type'

const DialogAssemblyCE: React.FC<DialogPartProps> = (props) => {
  const { permissions, loading, tab, wiki_page, detail, historyLogs, onSubmit, onClose, onChangeTab } = props
  const { t } = useTranslation('assembly')

  const dispatch = useDispatch()
  const parameters = useSelector(partStore.selectParameters)
  const isCreating = _.isNil(detail.id)

  const vaidationSchema = useMemo(() => getValidationSchema(t), [])
  const assemblyForm = useForm<AssemblyDetail>({
    shouldUnregister: false,
    resolver: yupResolver(vaidationSchema)
  })

  useEffect(() => {
    assemblyForm.reset(detail)
  }, [detail])

  const handleSubmitForm = assemblyForm.handleSubmit((data) => {
    data.drawing_id = (data.drawing_id as DataForDropdown).value
    data.manufacturers = _.map(data.manufacturers, (manu) => _.omit(manu, 'description'))
    const formData = _.pick(data, [
      'job_id',
      'drawing_id',
      'dpn',
      'unit',
      'descriptions',
      'manufacturers',
      'items',
      'additional_attributes'
    ])
    onSubmit(data.id, formData as any)
  })

  const handleChangeHistoryLogs = (data: HistoryLog[]) => {
    dispatch(partStore.actions.setHistoryLogs(data))
  }

  const generalTab = {
    label: t('common:tab.general'),
    panel: <TabGeneral />,
    errorKey: ['drawing_id', 'dpn']
  }

  const manufacturerTab = {
    label: t('form.tab.manufacturer'),
    panel: <TabManufacturer />
  }

  const componentTab = {
    label: t('form.tab.components'),
    panel: <TabComponent />
  }

  const parentTab = {
    label: t('form.tab.parent'),
    panel: <TabParent />,
    hide: isCreating
  }

  const historyTab = {
    label: t('common:tab.history'),
    panel: (
      <AppTabHistoryLog
        data={historyLogs}
        entityId={detail.id}
        mode="horizonatal"
        tableHeight={320}
        descriptionRows={19}
        entity="assembly"
        onChange={handleChangeHistoryLogs}
      />
    ),
    hide: isCreating
  }

  const extendedPropTab = {
    label: t('common:tab.extended_properties'),
    panel: (
      <TableExtendedProperties
        control={assemblyForm.control}
        name="additional_attributes"
        editMode={!isCreating}
        propertiesList={parameters.PAAT}
        tableHeight={325}
        parameterName="PAAT"
      />
    )
  }

  const tabs = [generalTab, manufacturerTab, componentTab, parentTab, extendedPropTab, historyTab]

  return (
    <DialogMain
      fullWidth
      maxWidth="md"
      open
      loading={loading}
      title={
        <BtnHelp
          title={isCreating ? t('form.title.create_assembly') : t('form.title.update_assembly')}
          href={wiki_page}
        />
      }
      onOk={handleSubmitForm}
      onClose={onClose}
      okText={isCreating ? t('common:button.create') : t('common:button.update')}
      okButtonProps={{ disabled: (!permissions?.edit && !isCreating) || loading }}
    >
      <Context.Provider value={{ loading }}>
        <FormControllerTabs form={assemblyForm} value={tab} onChange={onChangeTab} tabs={tabs} />
      </Context.Provider>
    </DialogMain>
  )
}

export default DialogAssemblyCE
