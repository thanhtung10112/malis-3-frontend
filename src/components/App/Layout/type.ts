import React from 'react'
import { Breadcrumb } from '@/components/App/Breadcrumb'
import { GridProps, GridSize } from '@material-ui/core'
import { AppButtonProps } from '../Button/type'
import { DataTableProps } from '../../DataTable/Main'
import { AppSearchBarProps } from '../SearchBar'
import { Entity } from '@/types/Common'

export interface ButtonLayout extends AppButtonProps {
  label: string
  hide?: boolean
}

export type BreakPoint = Record<'xs' | 'sm' | 'md' | 'xl', GridSize>

export interface LeftSection extends GridProps {
  Component: React.ReactNode
  breakPoint: Partial<BreakPoint>
  hide: boolean
}

export interface TableSection extends GridProps {
  breakPoint: Partial<BreakPoint>
}

export interface LayoutProps {
  entity: Entity
  breadcrumbs: Breadcrumb[]
  wikiPage?: string
  tableProps?: Partial<DataTableProps> & Pick<DataTableProps, 'columns'>
  buttons?: ButtonLayout | ButtonLayout[]
  exportable?: boolean
  permissions?: any
  filterable?: boolean
  searchProps?: Partial<AppSearchBarProps>
  tableHeight?: string | number
  Dialogs?: React.ReactNode
  Options?: React.ReactNode
  Body?: React.ReactNode
  leftSection?: LeftSection
  tableSection?: TableSection
  bottomSection?: React.ReactNode
}
