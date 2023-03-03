import useAuthMiddleware from '@/hooks/useAuthMiddleware'

import LayoutEquivalence from '@/components/LayoutEquivalence'

function MaterialStandardsPage() {
  return <LayoutEquivalence equivalenceType="material_standard" />
}

export const getServerSideProps = useAuthMiddleware(['common', 'equivalence', 'make_a_list', 'advanced_filter'])

export default MaterialStandardsPage
