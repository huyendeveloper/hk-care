import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import { useMemo } from 'react';
import CreateCRUDForm from './CreateCRUDForm';

const getBreadcrums = () => [
  {
    text: 'Example CRUD',
    link: '/crm/accounts/',
  },
];

const CreateCRUD = () => {
  const breadcrumbs = useMemo(() => getBreadcrums(), []);

  return (
    <PageWrapper title="Example CRUD | Create">
      <PageBreadcrumbs
        category="Example"
        title="Create"
        breadcrumbs={breadcrumbs}
      />
      <CreateCRUDForm />
    </PageWrapper>
  );
};

export default CreateCRUD;
