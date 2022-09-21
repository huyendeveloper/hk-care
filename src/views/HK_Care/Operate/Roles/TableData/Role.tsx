import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Checkbox,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextareaAutosize,
} from '@mui/material';
import { Box } from '@mui/system';
import { useNotification } from 'hooks';
import { IRole } from 'interface';
import { useState } from 'react';
import { useDebounce } from 'react-use';
import userService, { IRoleSalePoint } from 'services/user.service';

interface IPermission {
  key: string;
  name: string;
  isGrant: boolean;
}

interface IProps {
  role: IRole;
  index: number;
  handleOpenDeleteDialog: (id: string | null) => void;
  addItem: boolean;
  handleAddItem: () => void;
  permission: IPermission[];
  setShowBackdrop: (status: boolean) => void;
}

const Role = ({
  role,
  index,
  handleOpenDeleteDialog,
  addItem,
  handleAddItem,
  permission,
  setShowBackdrop,
}: IProps) => {
  const setNotification = useNotification();
  const [roleDetail, setRoleDetail] = useState<IRole>(role);

  const handleChangeName = (e: any) => {
    const value = e.target.value;
    if (value) {
      setRoleDetail({ ...roleDetail, roleName: value });
    }
  };

  const handleChange = (e: any) => {
    const value = e.target.checked;
    setRoleDetail({ ...roleDetail, [e.target.name]: value });
  };

  const handleSave = async () => {
    if (roleDetail.roleName === '') {
      return;
    }

    if (
      roleDetail.roleName === role.roleName &&
      roleDetail.qlsp === role.qlsp &&
      roleDetail.qlkh === role.qlkh &&
      roleDetail.qlbh === role.qlbh &&
      roleDetail.qlvh === role.qlvh
    ) {
      return;
    }

    if (roleDetail.roleName || roleDetail.roleId) {
      const newPermission = [...permission];
      newPermission[0].isGrant = roleDetail.qlsp;
      newPermission[1].isGrant = roleDetail.qlkh;
      newPermission[2].isGrant = roleDetail.qlbh;
      newPermission[3].isGrant = roleDetail.qlvh;

      let newRole: IRoleSalePoint = {
        roleId: roleDetail.idRole,
        roleName: roleDetail.roleName,
        status: true,
        grantPermissionDtos: newPermission,
      };
      setShowBackdrop(true);

      try {
        const { data } = await userService.changeSalePointPermission(newRole);
        if (data) {
          setShowBackdrop(false);
          window.location.reload();
        }
      } catch (error) {
        setNotification({ error: 'Lỗi!' });
        setShowBackdrop(false);
      }
    }
  };

  useDebounce(
    () => {
      handleSave();
    },
    1000,
    [roleDetail]
  );

  const renderAction = () => {
    return (
      <Stack>
        {index !== 1 && (
          <IconButton
            onClick={() => handleOpenDeleteDialog(role?.idRole || null)}
          >
            <RemoveCircleIcon />
          </IconButton>
        )}
        {addItem && (
          <IconButton onClick={handleAddItem}>
            <AddIcon />
          </IconButton>
        )}
      </Stack>
    );
  };

  return (
    <TableRow hover tabIndex={-1} key={index}>
      <TableCell>
        {index === 1 ? (
          <Box pl="14px">Admin quản lý điểm bán</Box>
        ) : (
          <TextareaAutosize
            defaultValue={role.roleName}
            onChange={handleChangeName}
          />
        )}
      </TableCell>
      <TableCell>
        {
          <Checkbox
            name="qlsp"
            defaultChecked={role.qlsp}
            onChange={handleChange}
          />
        }
      </TableCell>
      <TableCell>
        {
          <Checkbox
            name="qlkh"
            defaultChecked={role.qlkh}
            onChange={handleChange}
          />
        }
      </TableCell>
      <TableCell>
        {
          <Checkbox
            name="qlbh"
            defaultChecked={role.qlbh}
            onChange={handleChange}
          />
        }
      </TableCell>
      <TableCell>
        {
          <Checkbox
            name="qlvh"
            defaultChecked={role.qlvh}
            onChange={handleChange}
          />
        }
      </TableCell>
      <TableCell>{renderAction()}</TableCell>
    </TableRow>
  );
};

export default Role;
