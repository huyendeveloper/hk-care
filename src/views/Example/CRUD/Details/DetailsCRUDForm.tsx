import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { Grid } from '@mui/material';
import LinkButton from 'components/common/LinkButton';
import LoadingScreen from 'components/common/LoadingScreen';
import ControllerDatePicker from 'components/Form/ControllerDatePicker';
import ControllerRadio from 'components/Form/ControllerRadio';
import ControllerSwitch from 'components/Form/ControllerSwitch';
import ControllerTextField from 'components/Form/ControllerTextField';
import ControllerTimePicker from 'components/Form/ControllerTimePicker';
import EntityMultipleSelecter from 'components/Form/EntityMultipleSelecter';
import EntitySelecter from 'components/Form/EntitySelecter';
import FormContent from 'components/Form/FormContent';
import FormFooter from 'components/Form/FormFooter';
import FormGroup from 'components/Form/FormGroup';
import FormHeader from 'components/Form/FormHeader';
import FormLabel from 'components/Form/FormLabel';
import FormPaperGrid from 'components/Form/FormPaperGrid';
import useMounted from 'hooks/useMounted';
import {
  mockMutipleSelectOptions,
  mockRadioOptions,
  mockSelectFieldOptions
} from 'mock-axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { ExampleCRUD, getCRUDDetails } from 'services/crud';
import * as yup from 'yup';

interface FormData {
  textField: string;
  selectField: number | null;
  mutipleSelectField: number[];
  radioField: number | null;
  switchField: boolean;
  date: Date | null;
  time: Date | null;
}

const validationSchema = yup.object().shape({
  textField: yup
    .string()
    .required('Required')
    .trim('Cannot include leading and trailing spaces')
    .strict(true)
    .default(''),
  selectField: yup.number().required('Required').nullable().default(null),
  mutipleSelectField: yup
    .array()
    .of(yup.number().required('Required').nullable().default(null))
    .min(1, 'Required')
    .default([]),
  radioField: yup.number().required('Required').nullable().default(null),
  switchField: yup.bool().default(false),
  date: yup
    .date()
    .required('Required')
    .nullable()
    .typeError('Invalid date')
    .default(null),
  time: yup
    .date()
    .required('Required')
    .nullable()
    .typeError('Invalid time')
    .default(null),
});

const DetailsCRUDForm = () => {
  const { id: crudId } = useParams();
  const mounted = useMounted();
  const [exmapleCRUDDetails, setExampleCRUDDetails] =
    useState<ExampleCRUD | null>(null);
  const [taskQueue, setTaskQueue] = useState<number>(0); //to render loading

  const {
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  //call api to get data details
  useEffect(() => {
    if (!crudId) return;

    setTaskQueue((task) => task + 1);
    getCRUDDetails(crudId)
      .then((res) => {
        setExampleCRUDDetails(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        if (mounted.current) {
          setTaskQueue((task) => task - 1);
        }
      });
  }, [crudId, mounted]);

  //reset form value form data details
  useEffect(() => {
    if (!exmapleCRUDDetails) return;

    const {
      date,
      time,
      mutipleSelectField,
      textField,
      switchField,
      selectField,
      radioField,
    } = exmapleCRUDDetails;

    reset({
      date: new Date(date),
      time: new Date(time),
      mutipleSelectField,
      textField,
      switchField,
      selectField,
      radioField,
    });
  }, [exmapleCRUDDetails, reset]);

  if (taskQueue > 0) {
    return <LoadingScreen />;
  }

  return (
    <FormPaperGrid noValidate>
      <FormHeader title="Details Title" />
      <FormContent>
        <FormGroup>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Text field" name="textField" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTextField
                disabled
                name="textField"
                control={control}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Select field" name="selectField" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <EntitySelecter
                disabled
                name="selectField"
                control={control}
                options={mockSelectFieldOptions}
                renderLabel={(field) => field.name}
                placeholder="Please select a field"
              />
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel
                required
                title="Mutiple select field"
                name="mutipleSelectField"
              />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <EntityMultipleSelecter
                disabled
                name="mutipleSelectField"
                control={control}
                options={mockMutipleSelectOptions}
                renderLabel={(field) => field.name}
                placeholder="Please select a field"
                forcePopupIcon={false}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Radio field" name="radioField" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerRadio
                disabled
                name="radioField"
                control={control}
                row
                options={mockRadioOptions}
              />
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel title="Switch field" name="switchField" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerSwitch
                disabled
                name="switchField"
                label="Switch field"
                control={control}
              />
            </Grid>
          </Grid>
        </FormGroup>
        <FormGroup>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Date" name="date" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerDatePicker
                disabled
                name="date"
                control={control}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormLabel required title="Time" name="time" />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
              <ControllerTimePicker
                disabled
                name="time"
                control={control}
                errors={errors}
              />
            </Grid>
          </Grid>
        </FormGroup>
      </FormContent>
      <FormFooter>
        <LinkButton startIcon={<ArrowBackIcon />} to="/example/crud">
          Back to list
        </LinkButton>

        <LinkButton
          variant="contained"
          startIcon={<EditIcon />}
          to={`/example/crud/${crudId}/edit`}
        >
          Edit
        </LinkButton>
      </FormFooter>
    </FormPaperGrid>
  );
};

export default DetailsCRUDForm;
