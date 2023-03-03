import _ from 'lodash'

import type { ItemDetail } from '@/types/Item'
import type { AssemblyDetail } from '@/types/Assembly'

export const isAssembly = (part: ItemDetail | AssemblyDetail) => Boolean(_.get(part, 'is_assembly'))

export const isAssemblyByDpn = (dpn: string) => _.indexOf(dpn, 'G') !== -1

export default isAssembly
