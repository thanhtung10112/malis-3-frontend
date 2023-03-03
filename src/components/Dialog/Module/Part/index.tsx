import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { If, Else, Then } from 'react-if'
import { DialogManufacturerCreateEdit } from '@/components'
import DialogItem from './Item'
import DialogAssembly from './Assembly'

import isAssembly from '@/utils/isAssembly'
import { partStore, commonStore } from '@/store/reducers'
import assemblyApi from '@/apis/assembly.api'
import itemApi from '@/apis/item.api'

import type { ItemDetail } from '@/types/Item'
import type { AssemblyDetail } from '@/types/Assembly'
import type { PartEntity } from '@/types/Part'
import type { ManufacturerItem } from '@/types/Manufacturer'
import type { DialogPartMainProps } from './type'

const PartDialog: React.FC<DialogPartMainProps> = ({ onClose }) => {
  const dispatch = useDispatch()
  const partList = useSelector(partStore.selectPartList)
  const manu = useSelector(partStore.selectPartManu)

  const handleClosePartDialog = (entity: PartEntity) => () => {
    if (partList.length > 1) {
      dispatch(partStore.sagaCloseDialog(entity))
    } else {
      dispatch(partStore.actions.removePart())
      onClose()
    }
  }

  const handleUpdatePart = async (entity: PartEntity, id: number, formData: ItemDetail | AssemblyDetail) => {
    const partApi = entity === 'item' ? itemApi : assemblyApi
    dispatch(partStore.actions.setPartLoading(true))
    try {
      const { message } = await partApi.update(id, formData)
      handleClosePartDialog(entity)()
      dispatch(commonStore.actions.setSuccessMessage(message))
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    dispatch(partStore.actions.setPartLoading(false))
  }

  const handleSubmit = (entity: PartEntity) => (id: number, formData: ItemDetail | AssemblyDetail) => {
    if (id) {
      handleUpdatePart(entity, id, formData)
    } else {
      dispatch(partStore.sagaCreate({ entity, formData }))
    }
  }

  const handleChangeTab = (event, nextTab: number) => {
    dispatch(partStore.actions.setPartTab(nextTab))
  }

  const renderPartDialog = useCallback(
    () =>
      partList.map(({ detail, ...partProps }) => (
        <If condition={isAssembly(detail)} key={detail.id}>
          <Then>
            <DialogAssembly
              {...partProps}
              detail={detail as AssemblyDetail}
              onSubmit={handleSubmit('assembly')}
              onClose={handleClosePartDialog('assembly')}
              onChangeTab={handleChangeTab}
            />
          </Then>
          <Else>
            <DialogItem
              {...partProps}
              detail={detail as ItemDetail}
              onSubmit={handleSubmit('item')}
              onClose={handleClosePartDialog('item')}
              onChangeTab={handleChangeTab}
            />
          </Else>
        </If>
      )),
    [partList]
  )

  const handleSubmitManu = (id: number, formData: ManufacturerItem) => {
    dispatch(partStore.sagaCreateManu(formData))
  }

  const handleCloseManuDialog = () => {
    dispatch(partStore.sagaCloseManuDialog())
  }

  const handleGetCodeManu = (currentData: ManufacturerItem) => {
    dispatch(partStore.sagaGetManuId(currentData))
  }

  return (
    <>
      {renderPartDialog()}
      <DialogManufacturerCreateEdit
        {...manu.dialogState}
        onSubmit={handleSubmitManu}
        onClose={handleCloseManuDialog}
        onGetNextCode={handleGetCodeManu}
        permissions={manu.initData.permissions}
        wikiPage={manu.initData.wiki_page}
        detail={manu.detail}
      />
    </>
  )
}

export default PartDialog
