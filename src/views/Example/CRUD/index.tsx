import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import CRUDTable from './CRUDTable';

const CRUD = () => {
  return (
    <PageWrapper title="Example CRUD">
      <PageBreadcrumbs
        category="Example"
        title="Example CRUD"
        breadcrumbs={[]}
      />
      <CRUDTable />
    </PageWrapper>
  );
};

export default CRUD;
