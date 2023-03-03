import useAuthMiddleware from '@/hooks/useAuthMiddleware'

import LayoutEquivalence from '@/components/LayoutEquivalence'

function ManufacturingStandardsPage() {
  return <LayoutEquivalence equivalenceType="manufacturing_standard" />
}

export const getServerSideProps = useAuthMiddleware(['common', 'equivalence', 'make_a_list', 'advanced_filter'])

export default ManufacturingStandardsPage
