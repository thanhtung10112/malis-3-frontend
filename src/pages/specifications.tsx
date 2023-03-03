import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useStyles from '@/styles/page/layout'
import useAuthMiddleware from '@/hooks/useAuthMiddleware'

import { useTranslation } from 'next-i18next'

import { Grid, Tooltip } from '@material-ui/core'

import {
  AppLayout,
  EditIcon,
  CreateIcon,
  DialogSpecificationCE,
  AppAutocompleteStyled,
  DeleteIcon,
  useConfirm,
  DialogDrawingCreateEdit
} from '@/components'

import { specificationStore, commonStore } from '@/store/reducers'
import { defaultProperties, iconColumn, descriptionsColumn } from '@/utils/columnProperties'
import getMessageConfirm from '@/utils/getMessageConfirm'
import parseHTML from 'html-react-parser'
import _ from 'lodash'

import type { GridColumns } from '@material-ui/data-grid'
import type { ParameterOption } from '@/types/Common'

const SpecificationsPage = () => {
  const classes = useStyles()
  const { t } = useTranslation('specification')
  const { confirm } = useConfirm()

  const breadcrumbData = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Drawings', href: '/drawings' },
      { label: 'Specifications Management', href: '/specifications' }
    ],
    []
  )

  const dispatch = useDispatch()
  const permissions = useSelector(specificationStore.selectPermissions)
  const userJob = useSelector(commonStore.selectUserValueJob)
  const selectedRows = useSelector(commonStore.selectSelectedRows)
  const currentLang = useSelector(commonStore.selectCurrentLanguage)
  const dataList = useSelector(specificationStore.selectDataList)
  const { wiki_page, column_tooltips, jobs: jobOptions } = useSelector(specificationStore.selectInitDataForList)

  useEffect(() => {
    return () => dispatch(commonStore.actions.resetUserValue())
  }, [])

  const handleOpenCreateDialog = () => {
    dispatch(specificationStore.sagaOpenCreateDialog())
  }

  const handleChangeUserJob = (event, optionValue: ParameterOption) => {
    dispatch(specificationStore.sagaChangeUserJob(optionValue))
  }

  const handleOpenUpdateDialog = (id: number) => () => {
    dispatch(specificationStore.sagaOpenUpdateDialog(id))
  }

  const handleDeleteSpecifications = async () => {
    const description = getMessageConfirm(t, 'specification', selectedRows, 'delete')
    const result = await confirm({ description })
    if (result === 'OK') {
      const specs = _.map(selectedRows, (partId) => {
        const { specification_id, id } = _.find(dataList, { id: partId })
        return { entity_id: specification_id, id }
      })
      dispatch(specificationStore.sagaRemove(specs))
    }
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
      description: column_tooltips.spec_id,
      field: 'specification_id',
      headerName: 'Document #',
      flex: 0.1
    },
    {
      ...defaultProperties,
      ...descriptionsColumn(currentLang),
      description: column_tooltips.description,
      headerName: 'Description',
      flex: 0.6,
      renderCell(params) {
        const { value } = params
        const description = parseHTML(value as string)
        return (
          <Tooltip title={description} classes={{ tooltip: classes.tooltip }}>
            <Grid
              container
              spacing={2}
              style={{
                whiteSpace: 'initial',
                alignSelf: 'baseline',
                lineHeight: 'initial'
              }}
            >
              <Grid item xs={12}>
                {description}
              </Grid>
            </Grid>
          </Tooltip>
        )
      }
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
      label: t('common:button.delete'),
      startIcon: <DeleteIcon />,
      onClick: handleDeleteSpecifications,
      disabled: !permissions?.delete || selectedRows.length === 0
    }
  ]

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
    </>
  )

  const Dialogs = (
    <>
      <DialogSpecificationCE />
      <DialogDrawingCreateEdit />
    </>
  )

  return (
    <AppLayout
      entity="specification"
      breadcrumbs={breadcrumbData}
      wikiPage={wiki_page}
      searchProps={{
        width: 320
      }}
      buttons={buttonsPage}
      permissions={permissions}
      tableProps={{
        columns,
        rowHeight: 150
      }}
      Dialogs={Dialogs}
      Options={Options}
    />
  )
}

export const getServerSideProps = useAuthMiddleware([
  'common',
  'specification',
  'make_a_list',
  'advanced_filter',
  'drawing',
  'item',
  'assembly',
  'element',
  'manufacturer'
])

export default SpecificationsPage
