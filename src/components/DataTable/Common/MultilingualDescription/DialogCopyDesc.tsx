import { useCallback, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Grid, Paper, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import { When } from 'react-if'
import { DialogMain, DataTable, AppAutocompleteAsync } from '@/components'

import _ from 'lodash'
import { commonStore } from '@/store/reducers'
import { defaultProperties } from '@/utils/columnProperties'
import HttpService from '@/helper/HttpService'

import type { MultilingualDescription } from '@/types/Common'

export type DialogCopyDescProps = {
  open: boolean
  compName: string
  onClose(): void
  entity: string
  descriptionValues: MultilingualDescription[]
  onChange(values: MultilingualDescription[]): void
  checkboxesToSelect?: CheckBoxCopyDesc[]
  autocompleteProps?: any
}

export type CheckBoxCopyDesc = {
  value: string
  label: string
  entity: string
  default?: boolean
}

export type DescriptionCopy = {
  description: string
  id: number
  language_desc: string
}

const DialogCopyDesc: React.FC<DialogCopyDescProps> = (props) => {
  const { open, onClose, compName, entity, descriptionValues, onChange, checkboxesToSelect, autocompleteProps } = props

  const httpService = new HttpService('')

  const dispatch = useDispatch()

  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [descriptionList, setDescriptionList] = useState<DescriptionCopy[]>([])
  const [paramApi, setParamApi] = useState({ entity: '', compName: '' })
  const [defaultOptions, setDefaultOptions] = useState([])

  const isContainCheckboxes = checkboxesToSelect.length > 0

  useEffect(() => {
    if (isContainCheckboxes) {
      const defaultCheckbox = _.find(checkboxesToSelect, { default: true })
      defaultCheckbox &&
        setParamApi({
          entity: defaultCheckbox.entity,
          compName: defaultCheckbox.value
        })
    } else {
      setParamApi({ entity, compName })
    }
  }, [entity, compName, checkboxesToSelect, isContainCheckboxes])

  const fecthDescs = async (id) => {
    setLoading(true)
    try {
      const data = await httpService.get(`${paramApi.entity}/${id}/descriptions`)
      const ids = data.descriptions.map((des) => des.id)
      setDescriptionList(data.descriptions)
      setSelectedRows(ids)
    } catch (error) {
      dispatch(commonStore.actions.setError(error))
    }
    setLoading(false)
  }

  const handleSelect = async (event, option) => {
    setSelectedRows([])
    await fecthDescs(option.value)
  }

  const handleSelectRows = ({ selectionModel }) => {
    setSelectedRows(selectionModel)
  }

  const handleCopyDescs = () => {
    const descList = descriptionList
      .filter((desc) => selectedRows.includes(desc.id))
      .map(({ description, id }) => ({ language_id: id, description }))
    const mergeDescription = _.uniqBy([...descList, ...descriptionValues], 'language_id')
    onChange(mergeDescription)
    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setDescriptionList([])
    setSelectedRows([])
    onClose()
  }

  const handleSelectModule =
    ({ entity, value }) =>
    () => {
      setParamApi({ entity, compName: value })
      setDefaultOptions([])
    }

  const renderCheckboxesSelect = useCallback(
    () =>
      checkboxesToSelect.map((checkbox) => (
        <FormControlLabel
          key={checkbox.value}
          value={checkbox.value}
          control={<Radio color="primary" onChange={handleSelectModule(checkbox)} />}
          label={checkbox.label}
        />
      )),
    [checkboxesToSelect, handleSelectModule]
  )

  return (
    <DialogMain
      open={open}
      title="Copy descriptions"
      fullWidth
      maxWidth="sm"
      loading={loading}
      onOk={handleCopyDescs}
      onClose={handleCloseDialog}
      okText="Save"
      okButtonProps={{ disabled: selectedRows.length === 0 || loading }}
    >
      <Grid container spacing={2} style={{ marginTop: 4 }}>
        <When condition={isContainCheckboxes}>
          <Grid item xs={12}>
            <RadioGroup row aria-label="position" name="position" defaultValue="top" value={paramApi.compName}>
              {renderCheckboxesSelect()}
            </RadioGroup>
          </Grid>
        </When>
        <Grid item xs={12}>
          <AppAutocompleteAsync
            disabled={!paramApi.compName}
            compName={paramApi.compName}
            onChange={handleSelect}
            label="Copy descriptions from"
            defaultOptions={defaultOptions}
            {...autocompleteProps}
          />
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <DataTable
              hideFooter
              tableHeight={275}
              rows={descriptionList}
              checkboxSelection
              selectionModel={selectedRows}
              onSelectionModelChange={handleSelectRows}
              columns={[
                {
                  ...defaultProperties,
                  field: 'language_desc',
                  headerName: 'Language',
                  width: 130
                },
                {
                  ...defaultProperties,
                  field: 'description',
                  headerName: 'Description',
                  flex: 0.7
                }
              ]}
            />
          </Paper>
        </Grid>
      </Grid>
    </DialogMain>
  )
}

DialogCopyDesc.defaultProps = {
  checkboxesToSelect: []
}

export default DialogCopyDesc
