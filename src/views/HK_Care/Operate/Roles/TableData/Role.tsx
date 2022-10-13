import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Checkbox,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextareaAutosize,
  TextField,
  Tooltip,
} from '@mui/material';
import { Box } from '@mui/system';
import { useNotification } from 'hooks';
import { IRole } from 'interface';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDebounce } from 'react-use';
import { changeSalePointPermission } from 'redux/slices/user';
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
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [roleDetail, setRoleDetail] = useState<IRole>(role);

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
    console.log('roleDetail', roleDetail);
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

      let newRole: IRoleSalePoint = {
        roleId: roleDetail.idRole,
        roleName: roleDetail.roleName,
        status: true,
        grantPermissionDtos: newPermission,
      };
      setShowBackdrop(true);

      // try {
      //   const { data } = await userService.changeSalePointPermission(newRole);
      //   if (data) {
      //     setShowBackdrop(false);
      //     window.location.reload();
      //   }
      //   console.log(data)
      // } catch (error) {
      //   setNotification({ error: 'Hệ thống đang gặp sự cố' });
      //   setShowBackdrop(false);
      // }

      const { payload, error } = await dispatch(
        // @ts-ignore
        changeSalePointPermission(newRole)
      );
      if (error) {
        setNotification({
          error: payload.response.data || 'Hệ thống đang gặp sự cố',
        });
        setShowBackdrop(false);
        return;
      }
      setShowBackdrop(false);
      window.location.reload();
    }
  };

  useDebounce(
    () => {
      handleSave();
    },
    2000,
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
      {console.log(
        'role.roleName.length === 0 :>> ',
        role.roleName.length === 0
      )}
      <TableCell>
        {index === 1 ? (
          <Box pl="14px">Admin quan ly diem ban</Box>
        ) : (
          <Tooltip title={roleDetail.roleName || ''} placement="bottom">
            <TextField
              defaultValue={role.roleName}
              onChange={handleChangeName}
              error={roleDetail.roleName.length === 0 && Boolean(role.idRole)}
              helperText={
                roleDetail.roleName.length === 0 && Boolean(role.idRole)
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
