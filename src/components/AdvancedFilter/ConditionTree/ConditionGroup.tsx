import { useState } from 'react'
import { useTranslation } from 'next-i18next'

import { format as formatDate } from 'date-fns'
import { TreeItem } from '@material-ui/lab'
import { AddCircle, Cancel } from '@material-ui/icons'

import { Menu, MenuItem, IconButton, ButtonGroup, Tooltip } from '@material-ui/core'

import { Unless } from 'react-if'

import { v1 as uuidv1 } from 'uuid'

import ConditionRule from './ConditionRule'
import ConjunctionOptions from './ConjunctionOptions'

import useStyles from '../styles'

// The condition group component, which can contain other rules or groups
function ConditionGroup({
  columnOptions,
  comparatorOptions,
  conjunctionOptions,
  level,
  groupData,
  parent: parentGroup,
  forceParentRerender,
  disabled,
  maxLevel
}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const classes = useStyles()

  const { t } = useTranslation(['advanced_filter'])

  // trick for forcing rerender
  const [, setValue] = useState(0)
  const forceRerender = () => {
    setValue((value) => value + 1)
  }
  const groupConditions = []

  for (const condition of groupData.conditions) {
    if (condition.type === 'rule') {
      groupConditions.push(
        <ConditionRule
          key={condition.condition_id}
          ruleData={condition}
          parent={groupData}
          forceParentRerender={forceRerender}
          columnOptions={columnOptions}
          comparatorOptions={comparatorOptions}
          disabled={disabled}
        />
      )
    } else {
      // condition.type === "group"
      groupConditions.push(
        <ConditionGroup
          maxLevel={maxLevel}
          key={condition.condition_id}
          groupData={condition}
          level={level + 1}
          parent={groupData}
          forceParentRerender={forceRerender}
          columnOptions={columnOptions}
          comparatorOptions={comparatorOptions}
          conjunctionOptions={conjunctionOptions}
          disabled={disabled}
        />
      )
    }
  }

  // Some neccessary functions

  const openAddMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeAddMenu = () => {
    setAnchorEl(null)
  }

  const handleAddOptions = (type) => () => {
    if (type === 'rule') {
      const newRule: any = {
        type: 'rule',
        id: columnOptions[0].id,
        condition_id: uuidv1()
      }

      switch (columnOptions[0].column_type) {
        case 'string':
          newRule.value = ''
          newRule.comparator = 'ilike'
          break
        case 'number':
          newRule.value = 0
          newRule.comparator = 'eq'
          break
        case 'date':
          newRule.value = formatDate(new Date(), 'yyyy-MM-dd')
          newRule.comparator = 'eq'
          break
        case 'datetime':
          newRule.value = formatDate(new Date(), 'yyyy-MM-dd HH:mm')
          newRule.comparator = 'eq'
          break
        case 'predefined_value':
          newRule.value = []
          newRule.comparator = 'in'
          newRule.value_as_string = columnOptions[0].value_as_string
          break
        case 'boolean':
          newRule.value = false
          newRule.comparator = 'eq'
          break
      }
      groupData.conditions.push(newRule)
    } else {
      // type = "group"
      groupData.conditions.push({
        conjunction: conjunctionOptions[0].value,
        type: 'group',
        conditions: [],
        condition_id: uuidv1()
      })
    }
    closeAddMenu()
  }

  const removeGroup = (group_condition_id) => () => {
    const newParentGroupConditions = parentGroup.conditions.filter((cond) => cond.condition_id !== group_condition_id)
    parentGroup.conditions = newParentGroupConditions
    forceParentRerender()
  }

  const handleGroupConjunctionChange = (value) => {
    groupData.conjunction = value
    forceParentRerender()
  }

  return (
    <>
      <TreeItem
        nodeId="group"
        style={{
          borderLeft: level === 0 ? '' : '1px #D8D8D8 dashed',
          marginLeft: level === 0 ? '' : '1.65rem',
          marginTop: level === 0 ? '' : '0.5rem'
        }}
        label={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ConjunctionOptions
              conjunctionOptions={conjunctionOptions}
              value={groupData.conjunction}
              onGroupConjunctionChange={handleGroupConjunctionChange}
              disabled={disabled}
            />

            <Unless condition={disabled}>
              <ButtonGroup className={classes.buttonGroup} size="small">
                <IconButton aria-label="Add" aria-controls="add-menu" aria-haspopup="true" onClick={openAddMenu}>
                  <AddCircle className={classes.iconButton} />
                </IconButton>

                <Unless condition={level === 0}>
                  <Tooltip title={t('tooltip.condition_remove_group')}>
                    <IconButton onClick={removeGroup(groupData.condition_id)}>
                      <Cancel className={classes.iconButton} />
                    </IconButton>
                  </Tooltip>
                </Unless>
              </ButtonGroup>

              <Menu id="add-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={closeAddMenu}>
                <MenuItem onClick={handleAddOptions('rule')}>{t('condition_group.add_rule')}</MenuItem>

                <Unless condition={level >= maxLevel}>
                  <MenuItem onClick={handleAddOptions('group')}>{t('condition_group.add_group')}</MenuItem>
                </Unless>
              </Menu>
            </Unless>
          </div>
        }
      >
        {groupConditions}
      </TreeItem>
    </>
  )
}

export default ConditionGroup
