import type { AssemblyDetail } from './Assembly'
import type { ItemDetail } from './Item'

export type PartEntity = 'item' | 'assembly'

export type PartDetail = ItemDetail | AssemblyDetail
