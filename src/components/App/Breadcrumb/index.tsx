import { Breadcrumbs, Typography, Link } from '@material-ui/core'
import { LiveHelpOutlined as LiveHelpOutlinedIcon } from '@material-ui/icons'
import NextLink from 'next/link'

import clsx from 'clsx'

import useStyles from './styles'

export type Breadcrumb = {
  label: string
  href: string
}

export type AppBreadcrumbProps = {
  items: Breadcrumb[]
  wikiPage?: string
}

const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({ items, wikiPage }) => {
  const classes = useStyles()

  const renderItems = () =>
    items.map((loc, index) => (
      <NextLink href={loc.href} key={`${loc}-${index}`}>
        <a href={loc.href}>
          <Typography variant="body1" className={clsx(classes.item, index === items.length - 1 && classes.lastItem)}>
            {loc.label}
          </Typography>
        </a>
      </NextLink>
    ))
  return (
    <section className={classes.root}>
      <div className={classes.list}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {renderItems()}
        </Breadcrumbs>
      </div>
      <Link href={wikiPage} target="_blank">
        <LiveHelpOutlinedIcon className={classes.helpIcon} />
      </Link>
    </section>
  )
}

AppBreadcrumb.defaultProps = {
  items: [],
  wikiPage: ''
}

export default AppBreadcrumb
