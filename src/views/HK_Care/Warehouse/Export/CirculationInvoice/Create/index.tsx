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
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDataUpdate = async () => {
    setLoading(true);
    // @ts-ignore
    const { payload, error } = await dispatch(
      // @ts-ignore
      getDetailExportWHRotation({ id: exportWHId, childId: id })
    );

    if (error) {
      setNotification({ error: 'Hệ thống đang gặp sự cố' });
      setLoading(false);
      return;
    }

    setExportWHRotation(payload.exportWHRotation);
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchDataUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && id) {
    return <LoadingScreen />;
  }

  return <FormData defaultValue={exportWHRotation} />;
};

export default CreateForm;
