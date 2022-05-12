import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import UserProfileTab from './UserProfileTab';

const UserProfile = () => {
  return (
    <PageWrapper title="User">
      <UserProfileTab />
    </PageWrapper>
  );
};

export default UserProfile;
