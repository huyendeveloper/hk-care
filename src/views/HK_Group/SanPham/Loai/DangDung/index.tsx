import { PageBreadcrums, PageWrapper } from 'components/common';
import TableData from './TableData';

const breadcrumbs = [
  {
    text: 'Quản lý sản phẩm',
    link: '#',
  },
  {
    text: 'Loại sản phẩm',
    link: '#',
  },
];

const DangDung = () => {
  return (
    <PageWrapper title="Dạng dùng">
      <PageBreadcrums
        category="HK_Group"
        title="Dạng dùng"
        breadcrumbs={breadcrumbs}
      />
      <TableData />
    </PageWrapper>
  );
};

export default DangDung;
