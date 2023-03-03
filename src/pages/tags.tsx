import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useStyles from '@/styles/page/layout'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'
import { useTranslation } from 'next-i18next'

import { Link } from '@material-ui/core'

import {
  AppLayout,
  EditIcon,
  CreateIcon,
  AppAutocompleteStyled,
  DeleteIcon,
  SaveIcon,
  MakeAListIcon,
  DialogTag,
  useConfirm,
  AppAutocompleteStyledAsync,
  DialogDrawingCreateEdit
} from '@/components'

import _ from 'lodash'
import immer from 'immer'

import tagApi from '@/apis/tag.api'
import { tagStore, commonStore, drawingStore } from '@/store/reducers'
import { defaultProperties, iconColumn, descriptionsColumn } from '@/utils/columnProperties'
import getMessageConfirm from '@/utils/getMessageConfirm'
import { defaultTagInitDataForCE, defaultTagDetail } from '@/utils/defaultValues'

import type { GridColumns } from '@material-ui/data-grid'
import type { ParameterOption, PayloadOperation, DataForDropdown } from '@/types/Common'

const Specifications_Page = () => {
  const classes = useStyles()
  const { t } = useTranslation('element')
  const { confirm } = useConfirm()

  const [openDialog, setOpenDialog] = useState(false)
  const [initDataForCE, setInitDataForCE] = useState(defaultTagInitDataForCE)
  const [tagDetail, setTagDetail] = useState(defaultTagDetail)

  const breadcrumbData = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Drawings', href: '/Drawings' },
      { label: 'Tags Management', href: '/Tags' }
    ],
    []
  )

  const dispatch = useDispatch()
  const permissions = useSelector(tagStore.selectPermissions)
  const userJob = useSelector(commonStore.selectUserValueJob)
  const { wiki_page, column_tooltips, jobs: jobOptions } = useSelector(tagStore.selectInitDataForList)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const dataList = useSelector(tagStore.selectDataList)
  const userDrawing = useSelector(commonStore.selectUserValueDrawing)
  const currentLang = useSelector(commonStore.selectCurrentLanguage)

  useEffect(() => {
    return () => dispatch(commonStore.actions.resetUserValue())
  }, [])

  useEffect(() => {
    const schematicValue = userDrawing.value > 0 ? userDrawing : null
    setTagDetail((currentState) =>
      immer(currentState, (draft) => {
        draft.schematic_id = schematicValue
      })
    )
  }, [userDrawing])

  useEffect(() => {
    setTagDetail((currentState) =>
      immer(currentState, (draft) => {
        draft.job_id = userJob.value
      })
    )
  }, [userJob])

  const resetDetail = () => {
    setTagDetail(() =>
      immer(defaultTagDetail, (draft) => {
        draft.schematic_id = userDrawing.value > 0 ? userDrawing : null
        draft.job_id = userJob.value
      })
    )
  }

  const handleOpenCreateDialog = async () => {
    dispatch(commonStore.actions.setLoadingPage(true))
    try {
      const resInitDataForCE = await tagApi.getInitDataForCE({ job_id_pk: userJob.value })
      setInitDataForCE(resInitDataForCE)
      if (userDrawing.value > 0) {
        const { generated_code } = await tagApi.getGenerateCode(userDrawing.value)
        setTagDetail((currentState) =>
          immer(currentState, (draft) => {
            draft.element_id = generated_code
          })
        )
      }
      setOpenDialog(true)
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    dispatch(commonStore.actions.setLoadingPage(false))
  }

  const handleOpenUpdateDialog = (id: number) => async () => {
    dispatch(commonStore.actions.setLoadingPage(true))
    try {
      const resInitDataForCE = await tagApi.getInitDataForCE({ job_id_pk: userJob.value })
      const { element } = await tagApi.getDetail(id)
      setInitDataForCE(resInitDataForCE)
      setTagDetail(
        immer(element, (draft) => {
          draft.schematic_id = element.related_schematic
          draft.part_id = element.related_part
        }) as any
      )
      setOpenDialog(true)
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    dispatch(commonStore.actions.setLoadingPage(false))
  }

  const handleChangeUserJob = (event, optionValue: ParameterOption) => {
    dispatch(tagStore.sagaChangeUserJob(optionValue))
  }

  const handleChangeUserDrawing = (event, optionValue: DataForDropdown) => {
    dispatch(tagStore.sagaChangeUserDrawing(optionValue))
  }

  const handleDeleteTags = async () => {
    const description = getMessageConfirm(t, 'element', selectedRows, 'delete')
    const result = await confirm({ description })
    if (result === 'OK') {
      const tags: PayloadOperation[] = _.map(selectedRows, (partId) => {
        const { schematic_id, id } = _.find(dataList, { id: partId })
        return { entity_id: schematic_id, id }
      })
      dispatch(commonStore.sagaExecuteOperation({ entity: 'element', operation: 'delete', operationList: tags }))
    }
  }

  const handleOpenDrawingDialog = (schematicId: number) => () => {
    dispatch(drawingStore.sagaOpenUpdateDialog(schematicId))
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    resetDetail()
    dispatch(tagStore.sagaGetList())
  }

  const columns: GridColumns = [
    {
      ...defaultProperties,
      ...iconColumn,
      description: column_tooltips.edit,
      field: 'id',
      headerName: 'Edit',
      renderCell: (params) => {
        return <EditIcon onClick={handleOpenUpdateDialog(params.value as number)} />
      }
    },
    {
      ...defaultProperties,
      description: column_tooltips.schematic_id,
      field: 'schematic_id',
      headerName: 'Schematic #',
      flex: 0.15,
      renderCell(params) {
        const { value, row } = params
        return (
          <Link href="#" onClick={handleOpenDrawingDialog(row.schematic_pk_id)}>
            {value}
          </Link>
        )
      }
    },
    {
      ...defaultProperties,
      description: column_tooltips.element_id,
      field: 'element_id',
      headerName: 'Element #',
      flex: 0.15
    },
    {
      ...defaultProperties,
      description: column_tooltips.tag,
      field: 'tag',
      headerName: 'Tag #',
      flex: 0.15
    },
    {
      ...defaultProperties,
      description: column_tooltips.part_id,
      field: 'part_id',
      headerName: 'Part #',
      flex: 0.2
    },
    {
      ...defaultProperties,
      ...descriptionsColumn(currentLang),
      description: column_tooltips.description,
      flex: 0.6
    },
    {
      ...defaultProperties,
      description: column_tooltips.rfq_id,
      field: 'rfq_id',
      headerName: 'RFQ #',
      width: 80
    },
    {
      ...defaultProperties,
      description: column_tooltips.rfo_id,
      field: 'rfo_id',
      headerName: 'RFO  #',
      width: 80
    },
    {
      ...defaultProperties,
      description: column_tooltips.puco_id,
      field: 'puco',
      headerName: 'PuCo',
      width: 80
    },
    {
      ...defaultProperties,
      description: column_tooltips.order_id,
      field: 'order_id',
      headerName: 'Order  #',
      width: 120
    },
    {
      ...defaultProperties,
      description: column_tooltips.box_nr,
      field: 'box_nr',
      headerName: 'BoxNr',
      width: 80
    },
    {
      ...defaultProperties,
      description: column_tooltips.cnt_nr,
      field: 'cnt_nr',
      headerName: 'CntNr',
      width: 80
    },
    {
      ...defaultProperties,
      description: column_tooltips.package_id,
      field: 'package_id',
      headerName: 'Package #',
      width: 80
    }
  ]

  const buttonsPage = [
    {
      label: t('common:button.new'),
      startIcon: <CreateIcon />,
      onClick: handleOpenCreateDialog,
      disabled: !permissions?.create || userJob.value < 0 || !userJob?.value
    },
    {
      label: t('common:button.save'),
      startIcon: <SaveIcon />,
      disabled: !permissions?.edit
    },
    {
      label: t('common:button.delete'),
      startIcon: <DeleteIcon />,
      onClick: handleDeleteTags,
      disabled: !permissions?.delete || selectedRows.length === 0
    },
    {
      label: t('common:button.make_a_list'),
      startIcon: <MakeAListIcon />
    }
  ]

  const Dialogs = (
    <>
      <DialogTag open={openDialog} initData={initDataForCE} detail={tagDetail} onClose={handleCloseDialog} />
      <DialogDrawingCreateEdit />
    </>
  )

  const Options = (
    <>
      <AppAutocompleteStyled
        className={classes.controlAutocomplete}
        width={200}
        label="Jobs"
        options={jobOptions}
        value={userJob}
        renderOption={(option) => option.description}
        primaryKeyOption="value"
        onChange={handleChangeUserJob}
      />

      <AppAutocompleteStyledAsync
        disabled={!userJob?.value}
        width={250}
        label="Schematics"
        className={classes.controlAutocomplete}
        compName="drawing_list"
        additionalData={{
          limit_to_job: userJob.value,
          include_all_drawings_option: true
        }}
        onChange={handleChangeUserDrawing}
        value={userDrawing}
        defaultOptions={[commonStore.initialState.userValue.drawing]}
      />
    </>
  )

  return (
    <AppLayout
      entity="element"
      breadcrumbs={breadcrumbData}
      wikiPage={wiki_page}
      searchProps={{
        width: 320
      }}
      buttons={buttonsPage}
      permissions={permissions}
      tableProps={{
        columns
      }}
      Dialogs={Dialogs}
      Options={Options}
    />
  )
}

export const getServerSideProps = useAuthMiddleware([
  'common',
  'element',
  'make_a_list',
  'advanced_filter',
  'drawing',
  'item',
  'assembly'
])

export default Specifications_Page
