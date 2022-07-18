import { LoadingScreen } from 'components/common';
import { useNotification } from 'hooks';
import { IExportWHRotation } from 'interface';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getDetailExportWHRotation } from 'redux/slices/exportWHRotation';
import FormData from './FormData';

const CreateForm = () => {
  const { id, exportWHId } = useParams();
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [exportWHRotation, setExportWHRotation] =
    useState<IExportWHRotation | null>(null);

  const fetchDataUpdate = async () => {
    const { payload, error } = await dispatch(
      // @ts-ignore
      getDetailExportWHRotation({ id: exportWHId, childId: id })
    );

    if (error) {
      setNotification({ error: 'Lỗi!' });
      return;
    }

    setExportWHRotation(payload.exportWHRotation);
  };

  useEffect(() => {
    if (id) {
      fetchDataUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!exportWHRotation && id) {
    return <LoadingScreen />;
  }

  return <FormData defaultValue={exportWHRotation} />;
};

export default CreateForm;
