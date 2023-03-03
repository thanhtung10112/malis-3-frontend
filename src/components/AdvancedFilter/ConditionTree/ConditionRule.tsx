import { useState } from 'react'
import { useTranslation } from 'next-i18next'

import * as _ from 'lodash'

import { format as formatDate } from 'date-fns'

import { TreeItem } from '@material-ui/lab'
import { Cancel } from '@material-ui/icons'

import { IconButton, ButtonGroup, Tooltip } from '@material-ui/core'

import ColumnOptions from './ColumnOptions'
import ComparatorOptions from './ComparatorOptions'
import ConditionValue from './ConditionValue'

import { Unless } from 'react-if'

import useStyles from '../styles'

// A condition rule, which contains columns DD, comparators DD and value filed

function ConditionRule({
  ruleData,
  parent: parentGroup,
  forceParentRerender,
  columnOptions,
  comparatorOptions,
  disabled
}) {
  const { t } = useTranslation(['advanced_filter'])
  const classes = useStyles()
  // trick for forcing rerender
  const [, setValue] = useState(0)
  const forceRerender = () => {
    setValue((value) => value + 1)
  }

  const removeRule = (condition_id) => () => {
    const newParentGroupConditions = parentGroup.conditions.filter((cond) => cond.condition_id !== condition_id)
    parentGroup.conditions = newParentGroupConditions
    forceParentRerender()
  }

  const handleColumnNameChange = (value) => {
    const selectedColumn = _.find(columnOptions, { id: value })
    ruleData.id = selectedColumn.id
    ruleData.column_type = selectedColumn.column_type

    switch (ruleData.column_type) {
      case 'string':
        ruleData.value = ''
        ruleData.comparator = 'ilike'
        break
      case 'number':
        ruleData.value = 0
        ruleData.comparator = 'eq'
        break
      case 'date':
        ruleData.value = formatDate(new Date(), 'yyyy-MM-dd')
        ruleData.comparator = 'eq'
        break
      case 'datetime':
        ruleData.value = formatDate(new Date(), 'yyyy-MM-dd HH:mm')
        ruleData.comparator = 'eq'
        break
      case 'predefined_value':
        ruleData.value = []
        ruleData.comparator = 'in'
        ruleData.value_as_string = selectedColumn.value_as_string
        break
      case 'boolean':
        ruleData.value = false
        ruleData.comparator = 'eq'
        break
    }

    forceRerender()
  }

  const handleComparatorChange = (newComparator) => {
    ruleData.comparator = newComparator
    forceRerender()
  }

  return (
    <>
      <TreeItem
        nodeId="root"
        onLabelClick={(event) => event.preventDefault()}
        style={{
          borderLeft: '1px #D8D8D8 dashed',
          marginLeft: '1.6rem',
          marginTop: '0.5rem'
        }}
        label={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ColumnOptions
              options={columnOptions}
              value={ruleData.id}
              onColumnNameChange={handleColumnNameChange}
              disabled={disabled}
            />
            <ComparatorOptions
              rules={ruleData}
              columnOptions={columnOptions}
              options={comparatorOptions}
              disabled={disabled}
              onComparatorChange={handleComparatorChange}
            />
            <ConditionValue rules={ruleData} columnOptions={columnOptions} disabled={disabled} />

            <Unless condition={disabled}>
              <Tooltip title={t('tooltip.condition_remove_rule')}>
                <ButtonGroup className={classes.buttonGroup} size="small">
                  <IconButton onClick={removeRule(ruleData.condition_id)}>
                    <Cancel className={classes.iconButton} />
                  </IconButton>
                </ButtonGroup>
              </Tooltip>
            </Unless>
          </div>
        }
      />
    </>
  )
}

export default ConditionRule
