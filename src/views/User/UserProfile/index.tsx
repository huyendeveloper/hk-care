import PageBreadcrumbs from 'components/common/PageBreadcrums';
import PageWrapper from 'components/common/PageWrapper';
import UserProfileTab from './UserProfileTab';

const UserProfile = () => {
  return (
    <PageWrapper title="User">
      <PageBreadcrumbs
        category="User"
        title="User profile"
        breadcrumbs={[]}
      />
      <UserProfileTab />
    </PageWrapper>
  );
};

export default UserProfile;
