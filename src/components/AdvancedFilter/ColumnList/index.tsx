import { useState } from 'react'

import { v1 as uuidv1 } from 'uuid'

import { AddCircle, Cancel } from '@material-ui/icons'
import { useTranslation } from 'next-i18next'

import { IconButton, ButtonGroup, Tooltip, Typography } from '@material-ui/core'

import * as _ from 'lodash'

import ColumnOptions from './ColumnOptions'
// import SortOptions from './SortOptions'

// The main component (which is exported)

function ColumnList({ columnOptions, selectedColumns, disabled, onRemove, onAdd }) {
  // trick for forcing rerender
  const [, setValue] = useState(0)
  const forceRerender = () => {
    setValue((value) => value + 1)
  }

  const { t } = useTranslation(['advanced_filter', 'make_a_list'])

  const selectedColumnsComponent = []

  const addNewColumn = (condition_id?) => () => {
    const columnIndex = _.findIndex(selectedColumns, {
      condition_id: condition_id
    })

    const selectedColumnsArr = selectedColumns.map((cond) => cond.id)

    selectedColumns.splice(columnIndex + 1, 0, {
      id: columnOptions.filter((colOpts) => !selectedColumnsArr.includes(colOpts.id))[0].id,
      condition_id: uuidv1()
    })
    forceRerender()
    onAdd()
  }

  const removeColumn = (condition_id) => () => {
    const columnIndex = _.findIndex(selectedColumns, {
      condition_id: condition_id
    })
    selectedColumns.splice(columnIndex, 1)
    forceRerender()
    onRemove()
  }

  for (const columnData of selectedColumns) {
    selectedColumnsComponent.push(
      <div style={{ marginBottom: '0.5rem' }}>
        <ColumnOptions
          columnOptions={columnOptions}
          condition={columnData}
          conditionData={selectedColumns}
          disabled={disabled}
        />

        {disabled ? (
          ''
        ) : (
          <ButtonGroup style={{ marginLeft: '0.5rem' }} size="small">
            {selectedColumns.length >= columnOptions.length ? (
              ''
            ) : (
              <Tooltip title={t('make_a_list:tooltip.add_column')}>
                <IconButton onClick={addNewColumn(columnData.condition_id)}>
                  <AddCircle style={{ color: '#7D90B2' }} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t('make_a_list:tooltip.remove_column')}>
              <IconButton onClick={removeColumn(columnData.condition_id)}>
                <Cancel style={{ color: '#7D90B2' }} />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        )}
      </div>
    )
  }

  return (
    <>
      {selectedColumns.length === 0 ? (
        <>
          {disabled ? (
            <div style={{ marginLeft: '1.6rem' }}>
              <Typography variant="subtitle1" gutterBottom color="textSecondary">
                {t('advanced_filter:column_list.no_column_selected')}
              </Typography>
            </div>
          ) : (
            <Tooltip title={t('advanced_filter:column_list.add_sort_condition')}>
              <IconButton onClick={addNewColumn()}>
                <AddCircle style={{ color: '#7D90B2' }} />
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        ''
      )}
      {selectedColumnsComponent}
    </>
  )
}

export default ColumnList

// // The main component (which is exported)
// function SortConditionList ({ columnOptions, sortOptions, sortData: sortConditionData, disabled, hideSortOption = false }) {
//   // trick for forcing rerender
//   const [, setValue] = useState(0)
//   const forceRerender = () => {
//     setValue((value) => value + 1)
//   }

//   const sortConditionComponents = []

//   const addNewSortCondition = (sortConditionId?) => () => {
//     const sortConditionIndex = _.findIndex(sortConditionData, {
//       id: sortConditionId
//     })
//     const selectedColumns = sortConditionData.map((cond) => cond.id)

//     sortConditionData.splice(sortConditionIndex + 1, 0, {
//       id: columnOptions.filter(
//         (col) => !selectedColumns.includes(col.id)
//       )[0].id,
//       direction: sortOptions[0].value
//     })
//     forceRerender()
//   }

//   const removeSortCondition = (sortConditionId) => () => {
//     const sortConditionIndex = _.findIndex(sortConditionData, {
//       id: sortConditionId
//     })
//     sortConditionData.splice(sortConditionIndex, 1)
//     forceRerender()
//   }

//   for (const sortCond of sortConditionData) {
//     sortConditionComponents.push(
//       <div style={{ marginBottom: '0.5rem' }}>
//         <ColumnOptions
//           columnOptions={columnOptions}
//           condition={sortCond}
//           conditionData={sortConditionData}
//           disabled={disabled}
//         />
//         {!hideSortOption && <SortOptions sortOptions={sortOptions} condition={sortCond} disabled={disabled} />}

//         {disabled ? '' : (
//           <ButtonGroup
//             style={{ marginLeft: '0.5rem' }}
//             size="small"
//           >
//             {sortConditionData.length >= columnOptions.length ? (
//               ''
//             ) : (
//               <IconButton onClick={addNewSortCondition(sortCond.id)}>
//                 <AddCircle />
//               </IconButton>
//             )}
//             <IconButton onClick={removeSortCondition(sortCond.id)}>
//               <Cancel />
//             </IconButton>
//           </ButtonGroup>
//         )}

//       </div>
//     )
//   }
//   return (
//     <>
//       {sortConditionData.length === 0 ? (
//         <>
//           {
//             disabled ? (
//               <div style={{ marginLeft: '1.6rem' }}>
//                 <Typography variant="subtitle1" gutterBottom color="textSecondary">
//                   No sort conditions
//                 </Typography>
//               </div>
//             ) : (
//               <Tooltip title="Add sort condition">
//                 <IconButton onClick={addNewSortCondition()}>
//                   <AddCircle />
//                 </IconButton>
//               </Tooltip>
//             )
//           }
//         </>
//       ) : (
//         ''
//       )}
//       {sortConditionComponents}
//     </>
//   )
// }

// export default SortConditionList
