import { Grid } from '@mui/material';
import {
  ControllerMultiFile,
  ControllerTextarea,
  ControllerTextField,
  FormContent,
  FormGroup,
  FormLabel,
} from 'components/Form';

interface IProps {
  control: any;
  files: File[] | object[];
}

const Details = ({ control, files }: IProps) => {
  return (
    <FormContent>
      <FormGroup>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormLabel required title="Tên nhà cung cấp" name="name" />
            <ControllerTextField disabled name="name" control={control} />
          </Grid>
          <Grid item xs={6}>
            <FormLabel title="Người liên hệ" name="nameContact" />
            <ControllerTextField
              disabled
              name="nameContact"
              control={control}
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel title="Địa chỉ" name="address" />
            <ControllerTextField disabled name="address" control={control} />
          </Grid>
          <Grid item xs={6}>
            <FormLabel title="Di động" name="mobileNumber" />
            <ControllerTextField
              disabled
              name="mobileNumber"
              control={control}
            />
          </Grid>{' '}
          <Grid item xs={6}>
            <FormLabel required title="Điện thoại" name="telephoneNumber" />
            <ControllerTextField
              disabled
              name="telephoneNumber"
              control={control}
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel title="Mã số thuế" name="taxCode" />
            <ControllerTextField disabled name="taxCode" control={control} />
          </Grid>
          <Grid item xs={6}>
            <FormLabel title="Fax" name="fax" />
            <ControllerTextField disabled name="fax" control={control} />
          </Grid>
          <Grid item xs={6}>
            <FormLabel title="Ghi chú" name="description" />
            <ControllerTextarea
              maxRows={5}
              minRows={5}
              name="description"
              control={control}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel
              required
              title="Đính kèm giấy chứng nhận"
              name="bussinessLicense"
            />
            <ControllerMultiFile
              files={files}
              setFiles={(file: File[] | object[]) => {}}
              viewOnly
            />
          </Grid>
        </Grid>
      </FormGroup>
    </FormContent>
  );
};

export default Details;
