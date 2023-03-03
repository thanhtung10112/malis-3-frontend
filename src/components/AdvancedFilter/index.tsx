import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useStyles from './styles'

import { ExpandMore, Close as CloseIcon } from '@material-ui/icons'

import { AccordionSummary, Accordion, Grid, AccordionDetails, Tooltip, Divider, Paper } from '@material-ui/core'

import { Skeleton } from '@material-ui/lab'

import { If, Then, Else } from 'react-if'

import { useTranslation } from 'next-i18next'

import FilterPresetList from './FilterPresetList'
import FilterDetails from './FilterDetails'

import { advancedFilterActions, commonStore } from '@/store/reducers'

function AdvancedFilter() {
  const classes = useStyles()

  const { t } = useTranslation(['advanced_filter'])

  const dispatch = useDispatch()
  const isExpaned = useSelector(advancedFilterActions.selectIsExpanedSection)
  const { section: isLoadingSection } = useSelector(advancedFilterActions.selectLoading)

  const [tooltip, setTooltip] = useState(t('tooltip.collapse'))
  const [activeTab, setActiveTab] = useState(0)

  const onToggleAccordion = () => {
    setTooltip(isExpaned ? t('tooltip.expand') : t('tooltip.collapse'))
    dispatch(advancedFilterActions.setExpandedSection(!isExpaned))
  }

  const onCloseAdvancedFilter = (event) => {
    event.stopPropagation()
    dispatch(advancedFilterActions.resetState())
    dispatch(commonStore.actions.setTableState({ page: 1 }))
    dispatch(advancedFilterActions.close())
  }

  const onChangeActiveTab = (_, tabIndex) => {
    setActiveTab(tabIndex)
  }

  useEffect(() => {
    return () => {
      dispatch(advancedFilterActions.resetState())
    }
  }, [])

  return (
    <Paper className={classes.root} elevation={0}>
      <If condition={isLoadingSection}>
        <Then>
          <Skeleton variant="rect" width="100%" height={44} animation="wave" />
        </Then>

        <Else>
          <Accordion expanded={isExpaned} onChange={onToggleAccordion}>
            <AccordionSummary
              className={classes.rootAccordionSummary}
              expandIcon={
                <Tooltip title={tooltip}>
                  <ExpandMore />
                </Tooltip>
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Tooltip title={t('tooltip.close')}>
                <CloseIcon className={classes.closeIcon} onClick={onCloseAdvancedFilter} />
              </Tooltip>
              <span className={classes.heading}>{t('advanced_filter')}</span>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={4} className={classes.rootPresetList}>
                  <FilterPresetList onChangeActiveTab={onChangeActiveTab} />
                  <Divider orientation="vertical" className="divider" />
                </Grid>
                <Grid item xs={8} className={classes.rootPresetDetail}>
                  <FilterDetails activeTab={activeTab} onChangeActiveTab={onChangeActiveTab} />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Else>
      </If>
    </Paper>
  )
}

export default AdvancedFilter
