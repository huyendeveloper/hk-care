import PasswordIcon from '@mui/icons-material/Password';
import PersonIcon from '@mui/icons-material/Person';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { Paper } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TabsContent from 'components/Tab/TabsContent';
import TabsWrapper from 'components/Tab/TabsWrapper';
import { SyntheticEvent, useMemo, useState } from 'react';
import ChangePassword from './ChangePassword';
import Overview from './Overview';

const getTabs = () => [
  {
    label: "Overview",
    value: 'overview',
    icon: <PersonIcon />,
    component: <Overview />,
  },

  {
    label: "Change password",
    value: 'changePassword',
    icon: <PasswordIcon />,
    component: <ChangePassword />,
  },
];

const UserProfileTab = () => {

  const [tab, setTab] = useState<string>('overview');

  const handleOnTabChange = (_event: SyntheticEvent, tab: string) => {
    setTab(tab);
  };

  const tabs = useMemo(() => getTabs(), []);

  return (
    <TabContext value={tab}>
      <TabsWrapper component={Paper}>
        <Tabs
          value={tab}
          onChange={handleOnTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map(({ label, value, icon }) => (
            <Tab
              key={value}
              label={label}
              value={value}
              icon={icon}
              iconPosition="start"
              sx={{
                minHeight: 50,
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
              }}
            />
          ))}
        </Tabs>
        <TabsContent>
          {tabs.map(({ value, label, component }) => (
            <TabPanel key={value} value={value} sx={{ p: 0, height: 1 }}>
              {component ?? label}
            </TabPanel>
          ))}
        </TabsContent>
      </TabsWrapper>
    </TabContext>
  );
};

export default UserProfileTab;
