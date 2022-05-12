import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import { useParams } from 'react-router-dom';
import DetailsForm from './DetailsForm';

const breadcrumbs = [
  {
    text: 'Quản lý sản phẩm',
    link: '#',
  },
  {
    text: 'Loại sản phẩm',
    link: '#',
  },
  {
    text: 'Dạng dùng',
    link: '/hk_group/san_pham/loai/dang_dung',
  },
];

const EditCRUD = () => {
  const { id: crudId } = useParams();

  return (
    <PageWrapper title="Dạng dùng">
      <PageBreadcrumbs
        category="HK_Group"
        title={crudId?.toString() || ''}
        breadcrumbs={breadcrumbs}
      />
      <DetailsForm />
    </PageWrapper>
  );
};

export default EditCRUD;
