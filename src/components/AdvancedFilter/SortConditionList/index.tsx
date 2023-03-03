import { useState } from 'react'

import { v1 as uuidv1 } from 'uuid'
import { useTranslation } from 'next-i18next'
import { AddCircle, Cancel } from '@material-ui/icons'

import { IconButton, ButtonGroup, Tooltip, Typography } from '@material-ui/core'

import * as _ from 'lodash'

import ColumnOptions from './ColumnOptions'
import SortOptions from './SortOptions'

import { Unless, If, Then, When, Else } from 'react-if'

import useStyles from '../styles'

// The main component (which is exported)
function SortConditionList({ columnOptions, sortOptions, sortData: sortConditionData, disabled }) {
  // trick for forcing rerender
  const [, setValue] = useState(0)
  const forceRerender = () => {
    setValue((value) => value + 1)
  }

  const classes = useStyles()
  const { t } = useTranslation(['advanced_filter'])

  const sortConditionComponents = []

  const addNewSortCondition = (sortConditionId?) => () => {
    const sortConditionIndex = _.findIndex(sortConditionData, {
      condition_id: sortConditionId
    })
    const selectedColumns = sortConditionData.map((cond) => cond.id)

    sortConditionData.splice(sortConditionIndex + 1, 0, {
      id: columnOptions.filter((col) => !selectedColumns.includes(col.id))[0].id,
      condition_id: uuidv1(),
      direction: sortOptions[0].value
    })
    forceRerender()
  }

  const removeSortCondition = (sortConditionId) => () => {
    const sortConditionIndex = _.findIndex(sortConditionData, {
      condition_id: sortConditionId
    })
    sortConditionData.splice(sortConditionIndex, 1)
    forceRerender()
  }

  for (const sortCond of sortConditionData) {
    sortConditionComponents.push(
      <div style={{ marginBottom: '0.5rem' }}>
        <ColumnOptions
          columnOptions={columnOptions}
          condition={sortCond}
          conditionData={sortConditionData}
          disabled={disabled}
        />
        <SortOptions sortOptions={sortOptions} condition={sortCond} disabled={disabled} />

        <Unless condition={disabled}>
          <ButtonGroup style={{ marginLeft: '0.5rem' }} size="small">
            {!(sortConditionData.length >= columnOptions.length) && (
              <Tooltip title={t('tooltip.sort_add_rule')}>
                <IconButton onClick={addNewSortCondition(sortCond.condition_id)}>
                  <AddCircle className={classes.iconButton} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t('tooltip.sort_remove_rule')}>
              <IconButton onClick={removeSortCondition(sortCond.condition_id)}>
                <Cancel className={classes.iconButton} />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Unless>
      </div>
    )
  }
  return (
    <>
      <When condition={sortConditionData.length === 0}>
        <If condition={disabled}>
          <Then>
            <div style={{ marginLeft: '1.6rem' }}>
              <Typography variant="subtitle1" gutterBottom color="textSecondary">
                {t('sort_condition.no_sort_conditions')}
              </Typography>
            </div>
          </Then>

          <Else>
            <Tooltip title={t('sort_condition.add_sort_condition')}>
              <IconButton onClick={addNewSortCondition()}>
                <AddCircle className={classes.iconButton} />
              </IconButton>
            </Tooltip>
          </Else>
        </If>
      </When>
      {sortConditionComponents}
    </>
  )
}

export default SortConditionList
