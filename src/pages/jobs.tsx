import { useTranslation } from 'next-i18next'
import { useDispatch, useSelector } from 'react-redux'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'
import useStyles from '@/styles/page/layout'

import { Tooltip } from '@material-ui/core'

import { Warning as WarningIcon, ErrorOutline as ErrorOutlineIcon } from '@material-ui/icons'

import {
  DialogJobCreateEdit,
  AppAutocompleteStyled,
  AppLayout,
  CreateIcon,
  EditIcon,
  MakeAListIcon,
  ViewEditionIcon
} from '@/components'

import { jobStore, commonStore, makeAListActions } from '@/store/reducers'

import * as columnProperties from '@/utils/columnProperties'

import type { GridColumns } from '@material-ui/data-grid'
import type { ParameterOption } from '@/types/Common'

function Jobs() {
  const classes = useStyles()
  const { t } = useTranslation('job')

  const breadcrumbData = [
    { label: 'Home', href: '/' },
    { label: 'Basic Options', href: '/jobs' },
    { label: 'Jobs Management', href: '/jobs' }
  ]

  const dispatch = useDispatch()
  const jobCategories = useSelector(jobStore.selectJobCategories)
  const selectedJobCategory = useSelector(jobStore.selectSelectedJobCategory)
  const jobPermissions = useSelector(jobStore.selectPermissions)
  const { column_tooltips, wiki_page } = useSelector(jobStore.selectInitDataForList)

  const onOpenMakeAList = () => {
    dispatch(makeAListActions.open())
  }

  const onChangeSelectedJobCategory = (event, jobCategory: ParameterOption) => {
    dispatch(jobStore.actions.setSelectedCategory(jobCategory))
    dispatch(commonStore.actions.setTableState({ page: 1 }))
    dispatch(jobStore.sagaGetList())
  }

  const onOpenCreateDialog = () => {
    dispatch(jobStore.sagaOpenCreateDialog())
  }

  const onUpdateDialog = (id: number) => () => {
    dispatch(jobStore.sagaOpenUpdateDialog(id))
  }

  const columns: GridColumns = [
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.iconColumn,
      field: 'id',
      headerName: 'Edit',
      description: column_tooltips.edit,
      renderCell(params) {
        return <EditIcon onClick={onUpdateDialog(params.value as number)} />
      }
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.job_id,
      field: 'job_id',
      headerName: 'Job #'
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.description,
      field: 'job_description',
      headerName: 'Description',
      flex: 0.4
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.language,
      field: 'language',
      headerName: 'Language'
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      description: column_tooltips.equipment_type,
      field: 'equipment_type',
      headerName: 'EqTy'
    },
    {
      ...columnProperties.defaultProperties,
      description: column_tooltips.erection_site,
      field: 'erection_site',
      headerName: 'Erection Site',
      flex: 0.2
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      field: 'erection_site_id',
      renderHeader() {
        return (
          <Tooltip title="Non-Conformity">
            <WarningIcon />
          </Tooltip>
        )
      },
      renderCell() {
        return <span>0</span>
      }
    },
    {
      ...columnProperties.defaultProperties,
      ...columnProperties.centerColumn,
      field: 'full_count',
      renderHeader() {
        return (
          <Tooltip title="Improvement">
            <ErrorOutlineIcon />
          </Tooltip>
        )
      },
      renderCell() {
        return <span>1</span>
      }
    }
  ]

  const buttons = [
    {
      label: t('common:button.new'),
      startIcon: <CreateIcon />,
      disabled: !jobPermissions?.create,
      onClick: onOpenCreateDialog
    },
    {
      label: t('common:button.make_a_list'),
      startIcon: <MakeAListIcon />,
      disabled: !jobPermissions?.make_a_list,
      onClick: onOpenMakeAList
    },
    {
      label: t('common:button.view_edition'),
      startIcon: <ViewEditionIcon />,
      disabled: true
    }
  ]

  return (
    <AppLayout
      entity="job"
      wikiPage={wiki_page}
      breadcrumbs={breadcrumbData}
      permissions={jobPermissions}
      buttons={buttons}
      tableProps={{
        columns: columns
      }}
      Dialogs={<DialogJobCreateEdit />}
      Options={
        <AppAutocompleteStyled
          width={280}
          label="Job Categories"
          className={classes.controlAutocomplete}
          options={jobCategories}
          value={selectedJobCategory}
          primaryKeyOption="value"
          renderOption={(option) => option.description}
          onChange={onChangeSelectedJobCategory}
        />
      }
    />
  )
}

export const getServerSideProps = useAuthMiddleware(['common', 'job', 'make_a_list', 'advanced_filter', 'currency'])

export default Jobs
