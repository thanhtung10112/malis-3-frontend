import { Link } from '@material-ui/core'
import {
  DialogDrawingCreateEdit,
  AppLayout,
  CreateIcon,
  DeleteIcon,
  MakeAListIcon,
  DrawingTreeView,
  ExcludeIcon,
  CadIcon,
  SearchPageIcon,
  ContractIcon,
  ViewEditionIcon,
  CopyIcon,
  EditIcon,
  useConfirm,
  AppAutocompleteStyled,
  DialogMain
} from '@/components'

import { useMemo, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'
import { useSelector, useDispatch } from 'react-redux'
import useStyles from '@/styles/page/layout'

import { drawingStore, commonStore } from '@/store/reducers'
import * as columnProperties from '@/utils/columnProperties'
import immer from 'immer'
import getMessageConfirm from '@/utils/getMessageConfirm'

import type { GridColumns } from '@material-ui/data-grid'
import type { ParameterOption } from '@/types/Common'

function DrawingsPage() {
  const classes = useStyles()
  const { t } = useTranslation('drawing')
  const { confirm } = useConfirm()

  const [fileTypeDialog, setFileTypeDialog] = useState({
    open: false,
    content: ''
  })

  const dispatch = useDispatch()
  const permissions = useSelector(drawingStore.selectPermissions)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const userJob = useSelector(commonStore.selectUserValueJob)
  const currentLang = useSelector(commonStore.selectCurrentLanguage)
  const { jobs: jobOptions, column_tooltips, wiki_page } = useSelector(drawingStore.selectInitDataForList)

  useEffect(() => {
    return () => dispatch(commonStore.actions.resetUserValue())
  }, [])

  const isAllJob = useMemo(() => userJob.value < 0, [userJob])

  const breadcrumbData = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Drawings', href: '/drawings' },
      { label: 'Drawings Management', href: '/drawings' }
    ],
    []
  )

  const handleOpenFileType = (windowPath) => (event) => {
    event.preventDefault()
    setFileTypeDialog({
      open: true,
      content: windowPath
    })
  }

  const handleCloseFileTypeDialog = () => {
    setFileTypeDialog((currentState) =>
      immer(currentState, (draft) => {
        draft.open = false
      })
    )
  }

  const columns: GridColumns = [
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.iconColumn,
      description: column_tooltips.edit,
      field: 'id',
      headerName: 'Edit',
      renderCell(params) {
        return <EditIcon onClick={handleOpenUpdateDialog(params.id as number)} />
      }
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.iconColumn,
      description: column_tooltips.copy,
      field: 'copy',
      headerName: 'Copy',
      valueGetter: (params) => params.id,
      renderCell() {
        return <CopyIcon />
      }
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.drawing_id,
      field: 'drawing_id',
      headerName: 'Job Drawing',
      width: 150
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.revision,
      field: 'revision',
      headerName: 'Rev',
      width: 150
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.descriptionsColumn(currentLang),
      description: column_tooltips.descriptions,
      flex: 0.3
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.raw_drawing_format,
      field: 'raw_drawing_format',
      headerName: 'Format',
      width: 100
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.raw_drawing_purpose,
      field: 'raw_drawing_purpose',
      headerName: 'Purpose',
      width: 100
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.part_id,
      field: 'number_of_parts',
      headerName: '# Parts',
      width: 100
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.tag_id,
      field: 'number_of_tags',
      headerName: '# Tags',
      width: 100
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.spec_id,
      field: 'number_of_specs',
      headerName: '# Specs',
      width: 100
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.raw_file_prefix,
      field: 'raw_file_prefix',
      headerName: 'File Prefix',
      width: 100
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.raw_file_type,
      field: 'raw_file_type',
      headerName: 'File Type',
      width: 100,
      renderCell: (params) => {
        const { windows_path } = params.row
        return (
          <Link href={windows_path} onClick={handleOpenFileType(windows_path)}>
            {params.value}
          </Link>
        )
      }
    }
  ]

  const handleOpenCreateDialog = () => {
    dispatch(drawingStore.sagaOpenCreateDialog())
  }

  const handleOpenUpdateDialog = (id: number) => () => {
    dispatch(drawingStore.sagaOpenUpdateDialog(id))
  }

  const handleChangeUserJob = (event, optionValue: ParameterOption) => {
    dispatch(drawingStore.sagaChangeUserJob(optionValue))
  }

  const handleRemoveDrawings = async () => {
    const description = getMessageConfirm(t, 'drawing', selectedRows, 'delete')
    const result = await confirm({
      description
    })
    if (result === 'OK') {
      dispatch(
        commonStore.sagaExecuteOperation({ entity: 'drawing', operationList: selectedRows, operation: 'delete' })
      )
    }
  }

  const renderButtons = [
    {
      label: t('common:button.new'),
      disabled: !permissions?.view || isAllJob || !userJob?.value,
      startIcon: <CreateIcon />,
      item: [
        {
          label: 'Create New Drawing',
          onClick: handleOpenCreateDialog
        },
        {
          label: 'Copy Drawing',
          disabled: true
        },
        {
          label: 'Import Drawing',
          disabled: true
        },
        {
          label: 'Import Drawing Titles',
          disabled: true
        }
      ]
    },
    {
      label: t('common:button.delete'),
      startIcon: <DeleteIcon />,
      onClick: handleRemoveDrawings,
      disabled: !permissions?.delete || selectedRows.length === 0 || isAllJob
    },
    {
      label: 'Exclude',
      startIcon: <ExcludeIcon />,
      disabled: isAllJob
    },
    {
      label: 'Export to CAD',
      startIcon: <CadIcon />,
      disabled: isAllJob
    },
    {
      label: t('common:button.make_a_list'),
      startIcon: <MakeAListIcon />,
      disabled: !permissions?.make_a_list
    },
    {
      label: 'Parents search',
      startIcon: <SearchPageIcon />,
      disabled: isAllJob
    },
    {
      label: 'View contract item',
      startIcon: <ContractIcon />,
      disabled: isAllJob
    },
    {
      label: 'View edition',
      startIcon: <ViewEditionIcon />,
      disabled: isAllJob
    }
  ]

  const Options = (
    <AppAutocompleteStyled
      width={250}
      primaryKeyOption="value"
      label="Jobs"
      className={classes.controlAutocomplete}
      options={jobOptions}
      value={userJob}
      renderOption={(option) => option.description}
      onChange={handleChangeUserJob}
    />
  )

  const Dialogs = (
    <>
      <DialogDrawingCreateEdit />
      <DialogMain
        open={fileTypeDialog.open}
        title="Infomation"
        description={fileTypeDialog.content}
        onClose={handleCloseFileTypeDialog}
      />
    </>
  )

  const layoutLeftSection = {
    Component: <DrawingTreeView />,
    breakPoint: { xs: 2 },
    hide: isAllJob,
    style: { height: '100%', overflowY: 'auto' }
  }

  const tableSection = { breakPoint: { xs: isAllJob ? 12 : 10 } }

  return (
    <AppLayout
      entity="drawing"
      breadcrumbs={breadcrumbData}
      wikiPage={wiki_page}
      permissions={permissions}
      searchProps={{
        width: 300
      }}
      buttons={renderButtons}
      Dialogs={Dialogs}
      Options={Options}
      leftSection={layoutLeftSection as any}
      tableSection={tableSection as any}
      tableProps={{
        columns: columns,
        onCellClick: (params, event) => {
          if (['raw_file_type', 'id'].includes(params.field)) {
            event.stopPropagation()
          }
        }
      }}
    />
  )
}

export const getServerSideProps = useAuthMiddleware([
  'common',
  'advanced_filter',
  'drawing',
  'item',
  'assembly',
  'manufacturer',
  'element'
])

export default DrawingsPage
