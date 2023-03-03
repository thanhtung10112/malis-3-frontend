import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Typography, Tooltip } from '@material-ui/core'
import { AppAutocomplete } from '@/components'

import _ from 'lodash'
import striptags from 'striptags'
import parseHTML from 'html-react-parser'
import isHTML from '@/utils/isHTML'
import HttpService from '@/helper/HttpService'
import { commonStore } from '@/store/reducers'

import type { DataForDropdown } from '@/types/Common'
import type { AppAutocompleteAsyncProps } from './type'

const AppAutocompleteAsync: React.FC<AppAutocompleteAsyncProps> = (props) => {
  const { compName, additionalData, onChange, defaultOptions, ...autoCompleteProps } = props

  const httpService = new HttpService('')

  const [dataOptions, setDataOptions] = useState<DataForDropdown[]>([])
  const [loading, setLoading] = useState(false)
  const [valueInput, setValueInput] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    setDataOptions(defaultOptions)
  }, [defaultOptions])

  const getOptionLabel = ({ description, entity_id }) => (description ? `${entity_id} - ${description}` : entity_id)

  const renderOption = ({ description, entity_id }) => {
    if (!description) {
      return entity_id
    }
    if (isHTML(description)) {
      const htmlContent = parseHTML(_.toString(description))
      const pureContent = striptags(description)
      return (
        <Tooltip title={htmlContent}>
          <Typography noWrap>{`${entity_id} - ${pureContent}`}</Typography>
        </Tooltip>
      )
    }
    return <Typography noWrap>{`${entity_id} - ${description}`}</Typography>
  }

  const handleInputDropdown = (event, value, reason) => {
    if (reason === 'input') {
      setValueInput(value)
      setDataOptions([])
    }
  }

  const handleKeypress = async (event) => {
    if (event.which === 13) {
      setLoading(true)
      try {
        const data: any = await httpService.get('data_for_dd', {
          comp_name: compName,
          additional_data: JSON.stringify(additionalData),
          s: valueInput
        })
        setDataOptions(data.data_for_dd)
      } catch (error) {
        dispatch(commonStore.actions.setError(error))
      }
      setLoading(false)
    }
  }

  const handleSelectOption = (event, option, reason, details) => {
    onChange(event, option, reason, details)
  }

  return (
    <AppAutocomplete
      loading={loading}
      options={dataOptions}
      onInputChange={handleInputDropdown}
      renderOption={renderOption}
      getOptionLabel={getOptionLabel}
      onChange={handleSelectOption}
      onKeyPress={handleKeypress}
      {...autoCompleteProps}
    />
  )
}

AppAutocompleteAsync.defaultProps = {
  additionalData: {},
  defaultOptions: [],
  disableClearable: true,
  primaryKeyOption: 'value'
}

export default AppAutocompleteAsync
