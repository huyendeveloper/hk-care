import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import { useMemo } from 'react';
import EditCRUDForm from './EditCRUDForm';

const getBreadcrums = () => [
  {
    text: 'Example CRUD',
    link: '/crm/accounts/',
  },
];

const EditCRUD = () => {
  const breadcrumbs = useMemo(() => getBreadcrums(), []);

  return (
    <PageWrapper title="Example CRUD | Edit">
      <PageBreadcrumbs
        category="Example"
        title="Edit"
        breadcrumbs={breadcrumbs}
      />
      <EditCRUDForm />
    </PageWrapper>
  );
};

export default EditCRUD;
