import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import CRUDTable from './CRUDTable';

const CRUD = () => {
  return (
    <PageWrapper title="Example CRUD">
      <CRUDTable />
    </PageWrapper>
  );
};

export default CRUD;
