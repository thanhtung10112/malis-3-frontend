import Link from 'next/link'

import { Typography, Box } from '@material-ui/core'
import { NavigationItem } from '@/components'

import useStyles from './styles'
import { useRouter } from 'next/router'

import clsx from 'clsx'

export interface LinkItem {
  label: string
  href: string
}

const AppNavigation: React.FC = () => {
  const classes = useStyles()
  const router = useRouter()

  const activeLink = router.pathname === '/'

  const basicOptions: LinkItem[] = [
    {
      label: 'Jobs Management',
      href: '/jobs'
    },
    {
      label: 'Locations Management',
      href: '/locations'
    },
    {
      label: 'Currencies Management',
      href: '/currencies'
    },
    {
      label: 'Budget Management',
      href: '/budget'
    },
    {
      label: 'Material Standards Equivalences Management',
      href: '/material_standards'
    },
    {
      label: 'Manufacturing Standards Equivalences Management',
      href: '/manufacturing_standards'
    }
  ]

  const drawingsManagement: LinkItem[] = [
    {
      label: 'Drawings Management',
      href: '/drawings'
    },
    {
      label: 'Items Management',
      href: '/items'
    },
    {
      label: 'Assemblies Management',
      href: '/assemblies'
    },
    {
      label: 'Manufacturers Management',
      href: '/manufacturers'
    },
    {
      label: 'Specifications Management',
      href: '/specifications'
    },
    {
      label: 'Tags Management',
      href: '/tags'
    },
    {
      label: 'Material List',
      href: '/material'
    }
  ]

  const systemManagament: LinkItem[] = [
    {
      label: 'Users Management',
      href: '/users'
    },
    {
      label: 'Groups Management',
      href: '/groups'
    },
    {
      label: 'Parameters Management',
      href: '/parameter_types'
    }
  ]

  return (
    <>
      <nav className={classes.navigation}>
        <div
          className={clsx(classes.navigationItem, {
            [classes.active]: activeLink
          })}
        >
          <Link href="/">
            <a>
              <Typography variant="body1" component={Box} fontWeight="fontWeightMedium" className={classes.label}>
                Home
              </Typography>
            </a>
          </Link>
        </div>
        <NavigationItem label="Basic Options" links={basicOptions} />
        <NavigationItem label="Drawings" links={drawingsManagement} />
        {/* <NavigationItem label="Requisition & Procurement" /> */}
        <NavigationItem label="System Management" links={systemManagament} />
      </nav>
    </>
  )
}

export default AppNavigation
