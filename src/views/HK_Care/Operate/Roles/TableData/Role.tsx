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

interface IProps {
  role: IRole;
  index: number;
  handleOpenDeleteDialog: (id: number | null) => void;
  addItem: boolean;
}

const Role = ({ role, index, handleOpenDeleteDialog, addItem }: IProps) => {
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

  const renderAction = () => {
    return (
      <Stack>
        <IconButton onClick={() => handleOpenDeleteDialog(role?.id || null)}>
          <RemoveCircleIcon />
        </IconButton>
        {addItem && (
          <IconButton>
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
