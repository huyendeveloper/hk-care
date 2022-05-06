import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import { useMemo } from 'react';
import DetailsCRUDForm from './DetailsCRUDForm';

const getBreadcrums = () => [
  {
    text: 'Example CRUD',
    link: '/crm/accounts/',
  },
];

const EditCRUD = () => {
  const breadcrumbs = useMemo(() => getBreadcrums(), []);

  return (
    <PageWrapper title="Example CRUD | Details">
      <PageBreadcrumbs
        category="Example"
        title="Details"
        breadcrumbs={breadcrumbs}
      />
      <DetailsCRUDForm />
    </PageWrapper>
  );
};

export default EditCRUD;
