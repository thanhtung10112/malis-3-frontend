import React from 'react'

import { Paper } from '@material-ui/core'

import { DataTableTextField, DialogCodeEditor, DataTableCellExpand, DataTable } from '@/components/index'

import { useController } from 'react-hook-form'

import _ from 'lodash'
import immer from 'immer'
import * as columnProperties from '@/utils/columnProperties'

import type { Control } from 'react-hook-form'

type TableAttributesProps<T = any> = {
  attributes: string
  control: Control<T>
  name: string
  parameterId: string
  config: any
}

function TableAttributes(props: TableAttributesProps) {
  const { attributes, parameterId, config, ...formProps } = props

  const attributeList = React.useMemo(() => {
    if (_.isEmpty(attributes)) {
      return []
    }
    return attributes.split(';').map((attr) => {
      return { attr }
    })
  }, [attributes])

  const [codeEditorState, setCodeEditorState] = React.useState({
    isOpen: false,
    value: '',
    attribute: '',
    mode: '',
    guideline: ''
  })

  const { field } = useController({ ...formProps })

  const getValueAttribute = (attr: string) => {
    const valueAttr = field.value[attr]
    return valueAttr || ''
  }

  const isMarkdownField = (attr: string) => {
    const queryFields = ['columns_definition', 'pre_select_query', 'from_clause']
    return parameterId === 'TTIP' || (parameterId === 'MKAL' && queryFields.includes(attr))
  }

  const onChangeAttr = (id, value) => {
    field.onChange(
      immer(field.value, (draft) => {
        draft[id] = value
      })
    )
  }

  const handleDbClickToEdit = (params, event) => {
    const { attr } = params.row
    if (isMarkdownField(attr)) {
      handleOpenCodeEditor(attr)
      event.stopPropagation()
    }
  }

  const handleOpenCodeEditor = (attr) => {
    setCodeEditorState((prevState) =>
      immer(prevState, (draft) => {
        draft.value = getValueAttribute(attr)
        draft.attribute = attr
        draft.mode = config?.attributes[attr]?.mode || 'json'
        draft.guideline = config?.attributes[attr]?.guideline || '(no guideline)'
        draft.isOpen = true
      })
    )
  }

  const onCodeEditorClose = () => {
    setCodeEditorState((prevState) =>
      immer(prevState, (draft) => {
        draft.isOpen = false
      })
    )
  }

  const onCodeEditorConfirm = (value, attribute) => {
    field.onChange(
      immer(field.value, (draft) => {
        draft[attribute] = value
      })
    )
    onCodeEditorClose()
  }

  return (
    <>
      <Paper elevation={1}>
        <DataTable
          tableHeight={200}
          rows={attributeList}
          hideFooter
          onCellDoubleClick={handleDbClickToEdit}
          getRowId={(params) => params.attr}
          columns={[
            {
              ...columnProperties.defaultProperties,
              field: 'attr',
              headerName: 'Attribute',
              sortable: false,
              width: 150
            },
            {
              ...columnProperties.defaultProperties,
              ...columnProperties.editCell('Value'),
              field: 'raw_value',
              flex: 0.75,
              valueGetter(params) {
                const { attr } = params.row
                const value = getValueAttribute(attr)
                return value
              },
              renderEditCell(params) {
                return <DataTableTextField params={params} onChangeValue={onChangeAttr} />
              },
              renderCell(params) {
                const { attr } = params.row
                if (isMarkdownField(attr)) {
                  return <div>{params.value}</div>
                }
                return <DataTableCellExpand value={params.value} width={params.colDef.width} />
              }
            }
          ]}
        />
      </Paper>
      <DialogCodeEditor {...codeEditorState} onClose={onCodeEditorClose} onConfirm={onCodeEditorConfirm} />
    </>
  )
}

export default TableAttributes
