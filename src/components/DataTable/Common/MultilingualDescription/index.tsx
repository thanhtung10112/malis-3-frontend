import React from 'react'

import { Paper, Button, Tooltip } from '@material-ui/core'
import { When } from 'react-if'

import { DataTable, DataTableTextField, CopyIcon } from '@/components'
import DialogRichTextEditor from './RichTextEditor'
import DialogCopyDesc from './DialogCopyDesc'

import { useController } from 'react-hook-form'
import useStyles from './styles'

import _ from 'lodash'
import immer from 'immer'
import clsx from 'clsx'
import striptags from 'striptags'
import * as yup from 'yup'
import parseHTML from 'html-react-parser'

import * as columnProperties from '@/utils/columnProperties'

import type { GridColumns } from '@material-ui/data-grid'
import type { TableMultilingualDescriptionProps } from './type'
import type { MultilingualDescription } from '@/types/Common'

const TableMultilingualDescription: React.FC<TableMultilingualDescriptionProps> = (props) => {
  const classes = useStyles()

  const {
    name,
    control,
    rules,
    editMode,
    languageList,
    tableHeight,
    editor,
    copyable,
    copyDialogProps,
    disabled,
    autocompleteProps,
    descriptionName,
    ...paperPropsRest
  } = props

  const defaultValueRTE = React.useMemo(
    () => ({
      isOpen: false,
      content: '',
      title: '',
      languageId: null
    }),
    []
  )

  const {
    field: { value: descriptionValues, onChange }
  } = useController({
    name,
    control
  })

  const [RTEState, setRTEState] = React.useState({ ...defaultValueRTE })
  const [openCopy, setOpenCopy] = React.useState(false)

  const getCellValue = (language_id: number) => {
    const cellItem = _.find(descriptionValues, { language_id })
    if (cellItem) {
      return cellItem[descriptionName] || ''
    }
    return ''
  }

  const getStylesRowDisabled = (params) => {
    const language = _.find(languageList, { id: params.id })
    return clsx({
      [classes.disable]: language?.status === false || disabled
    })
  }

  const filteredLanguageList = React.useMemo(() => {
    if (editMode) {
      return languageList.filter(
        (item) =>
          item.status === true ||
          descriptionValues.some(({ language_id }) => item.id === language_id && item.status === false)
      )
    } else {
      return languageList.filter((item) => item.status === true)
    }
  }, [editMode])

  const onDbClickCell = (params, event) => {
    const language = _.find(languageList, { id: params.id })
    if (language?.status === false || disabled) {
      event.stopPropagation()
    }
  }

  const columns = React.useMemo<GridColumns>(
    () => [
      {
        ...columnProperties.defaultProperties,
        field: 'description_raw',
        width: 130,
        headerName: 'Language',
        valueGetter(params) {
          return `${params.row.parameter_id} - ${params.row.description}`
        }
      },
      {
        ...columnProperties.defaultProperties,
        ...columnProperties.editCell(_.capitalize(descriptionName)),
        field: 'value_raw',
        flex: 0.7,
        hide: editor !== 'text',
        valueGetter(params) {
          const cellValue = getCellValue(params.id as number)
          return cellValue
        },
        renderEditCell(params) {
          return (
            <DataTableTextField
              params={params}
              onChangeValue={onChangeDescription}
              rules={yup.string().max(255, 'Description must be less than 255 characters!')}
            />
          )
        }
      },
      {
        ...columnProperties.defaultProperties,
        ...columnProperties.editCell(_.capitalize(descriptionName)),
        field: 'value_raw_editor',
        flex: 0.7,
        headerName: _.capitalize(descriptionName),
        hide: editor === 'text',
        renderCell(params) {
          const description = getCellValue(params.id as number)
          const pureContent = striptags(description)
          const htmlContent = parseHTML(_.toString(description))
          if (pureContent) {
            return (
              <Tooltip title={htmlContent}>
                <div className={classes.rteRoot} onDoubleClick={onOpenRTE(params.row)}>
                  {pureContent}
                </div>
              </Tooltip>
            )
          }
          return (
            <div className={classes.rteRoot} onDoubleClick={onOpenRTE(params.row)}>
              {pureContent}
            </div>
          )
        }
      }
    ],
    [descriptionValues, editor, descriptionName]
  )

  const onChangeDescription = (language_id: number, description: string) => {
    const newDescriptionValues = immer(descriptionValues, (draft) => {
      const existingDescIndex = _.findIndex(descriptionValues, { language_id })
      if (existingDescIndex === -1) {
        draft.push({ language_id, [descriptionName]: description })
      } else {
        draft[existingDescIndex][descriptionName] = description
      }
    })
    onChange(newDescriptionValues)
  }

  const onOpenRTE = (language) => () => {
    const currentContent = getCellValue(language.id)
    setRTEState((prevState) =>
      immer(prevState, (draft) => {
        draft.content = currentContent
        draft.languageId = language.id
        draft.title = `${language.parameter_id} - ${language.description}`
        draft.isOpen = true
      })
    )
  }

  const handleCloseRTE = () => {
    setRTEState({ ...defaultValueRTE })
  }

  const onCloseRTE = () => {
    handleCloseRTE()
  }

  const onConfirmRTE = (language_id, description) => {
    onChangeDescription(language_id, description)
    handleCloseRTE()
  }

  const handleOpenCopyDialog = () => {
    if (!disabled) {
      setOpenCopy(true)
    }
  }

  const handleCloseCopyDialog = () => {
    if (!disabled) {
      setOpenCopy(false)
    }
  }

  const createDesctiptions = (descs: MultilingualDescription[]) => {
    if (descriptionName === 'description') {
      return descs
    }
    return descs.map(({ language_id, description }) => ({ language_id, [descriptionName]: description }))
  }

  const handleCopyDescriptions = (descs: MultilingualDescription[]) => {
    const formatDescs = createDesctiptions(descs)
    onChange(formatDescs)
  }

  return (
    <>
      <When condition={copyable}>
        <Button
          disabled={disabled}
          startIcon={<CopyIcon />}
          style={{ marginBottom: 4, paddingTop: 0 }}
          onClick={handleOpenCopyDialog}
        >
          Copy
        </Button>
      </When>
      <Paper {...paperPropsRest}>
        <DataTable
          hideFooter
          disableSelectionOnClick
          disableColumnMenu
          tableHeight={tableHeight}
          rows={filteredLanguageList}
          columns={columns}
          onCellDoubleClick={onDbClickCell}
          getRowClassName={getStylesRowDisabled}
        />
        <DialogRichTextEditor
          isOpen={RTEState.isOpen}
          title={RTEState.title}
          content={RTEState.content}
          languageId={RTEState.languageId}
          onClose={onCloseRTE}
          onConfirm={onConfirmRTE}
        />
        <DialogCopyDesc
          {...(copyDialogProps as any)}
          autocompleteProps={autocompleteProps}
          descriptionValues={descriptionValues}
          open={openCopy}
          onClose={handleCloseCopyDialog}
          onChange={handleCopyDescriptions}
        />
      </Paper>
    </>
  )
}

TableMultilingualDescription.defaultProps = {
  editor: 'text',
  elevation: 1,
  tableHeight: 300,
  copyable: false,
  copyDialogProps: {} as any,
  disabled: false,
  descriptionName: 'description',
  autocompleteProps: {}
}

export default TableMultilingualDescription
