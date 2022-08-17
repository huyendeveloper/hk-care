import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  Checkbox,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import { IRole } from 'interface';
import { useState } from 'react';
import { useDebounce } from 'react-use';
import userService, { IRoleAdmin, IUpdateNorma } from 'services/user.service';

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
}

const Role = ({
  role,
  index,
  handleOpenDeleteDialog,
  addItem,
  handleAddItem,
  permission,
}: IProps) => {

  const [roleDetail, setRoleDetail] = useState<IRole>(role);

  const handleChangeName = (e: any) => {
    const value = e.target.value;
    setRoleDetail({ ...roleDetail, roleName: value });
  };

  const handleChange = (e: any) => {
    const value = e.target.checked;
    setRoleDetail({ ...roleDetail, [e.target.name]: value });
  };

  const handleSave = async () => {
    console.log('roleDetail', roleDetail)
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

    if (roleDetail.roleName || roleDetail.roleKey) {
      console.log('[...permission]', [...permission])
      const newPermission = [...permission];
      newPermission[0].isGrant = roleDetail.qlsp;
      newPermission[1].isGrant = roleDetail.qlkh;
      newPermission[2].isGrant = roleDetail.qlbh;
      newPermission[3].isGrant = roleDetail.qlvh;

      let newRole: IRoleAdmin[] = [{
        idRole: roleDetail.idRole,
        roleName: roleDetail.roleName,
        roleKey: roleDetail.roleKey,
        status: true,
        permissionDtos: newPermission,
      }];

      const { data } = await userService.processRoleAdmin(newRole);
      if (data) {
        console.log('data', data)
        if (newRole[0].idRole) {
          var changNo: IUpdateNorma = {
            name: data[0].roleKey,
            isDefault: false,
            isPublic: true,
            concurrencyStamp: undefined
          };
          await userService.changeNameRole(newRole[0].idRole, changNo);

        }
        window.location.reload();
      }
    }
  };

  useDebounce(() => {
    handleSave();
  }, 1500, [roleDetail]
  );

  const renderAction = () => {
    return (
      <Stack>
        <IconButton
          onClick={() => handleOpenDeleteDialog(role?.roleKey || null)}
        >
          <RemoveCircleIcon />
        </IconButton>
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
        <TextField defaultValue={role.roleName} onChange={handleChangeName} />
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
