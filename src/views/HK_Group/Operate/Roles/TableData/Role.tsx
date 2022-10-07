import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Box,
  Checkbox,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextareaAutosize,
  TextField,
  Tooltip,
} from '@mui/material';
import { IRole } from 'interface';
import { useState } from 'react';
import { useDebounce } from 'react-use';
import userService, { IRoleAdmin } from 'services/user.service';

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
  const [roleDetail, setRoleDetail] = useState<IRole>(role);

  // const handleChangeName = (e: any) => {
  //   const value = e.target.value;
  //   setRoleDetail({ ...roleDetail, roleName: value });
  // };

  const handleChangeName = (e: any) => {
    // const value = e.target.value;
    const value = e.target.value.replace(/[^a-zA-Z0-9 -_]/g, '');

    e.target.value = value;

    setRoleDetail({ ...roleDetail, roleName: value });
  };

  const handleChange = (e: any) => {
    const value = e.target.checked;
    setRoleDetail({ ...roleDetail, [e.target.name]: value });
  };

  const handleSave = async () => {
    if (roleDetail.roleName === '' || roleDetail.roleName.length === 1) {
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

      let newRole: IRoleAdmin = {
        roleId: roleDetail.roleId,
        roleName: roleDetail.roleName,
        grantPermissionDtos: newPermission,
      };

      setShowBackdrop(true);

      const { data } = await userService.processRoleAdmin(newRole);
      if (data) {
        setShowBackdrop(false);
        window.location.reload();
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
            onClick={() => handleOpenDeleteDialog(role?.roleId || null)}
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
          <Box pl="14px">Admin HKGroup</Box>
        ) : (
          <Tooltip title={roleDetail.roleName || ''} placement="bottom">
            <TextField
              defaultValue={role.roleName}
              onChange={handleChangeName}
              error={roleDetail.roleName.length === 0 && Boolean(role.roleId)}
              helperText={
                roleDetail.roleName.length === 0 && Boolean(role.roleId)
                  ? 'Vui lòng nhập tên vai trò'
                  : ''
              }
            />
          </Tooltip>
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
