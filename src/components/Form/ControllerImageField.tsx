import React, { useState, useEffect, useRef } from 'react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useNotification } from 'hooks';

interface IProps {
  image: Blob | null | string | undefined;
  setImage: (blob: Blob | null) => void;
  initPreview?: string | ArrayBuffer | null;
  disabled?: boolean;
}

const ControllerImageField = ({
  image,
  setImage,
  initPreview,
  disabled,
}: IProps) => {
  const inputRef = useRef();
  const setNotification = useNotification();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(
    initPreview || null
  );

  useEffect(() => {
    if (typeof image === 'string') {
      setPreview(image);
      return;
    }
    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        setPreview(reader.result);
      };
    }
  }, [image]);

  const handleChange = () => {
    // @ts-ignore
    const file = inputRef?.current?.files[0];
    if (file && file.type && file.type.substr(0, 5) === 'image') {
      setImage(file);
    } else {
      setNotification({
        message: 'File không đúng định dạng',
        severity: 'warning',
      });
    }
  };

  const handleClick = (event: any) => {
    event.preventDefault();
    // @ts-ignore
    inputRef?.current?.click();
  };

  const [enable, setEnable] = useState<boolean>(false);

  return (
    <div>
      <button
        className="button-select-file"
        style={{ cursor: disabled ? 'default' : 'pointer' }}
        onClick={handleClick}
      >
        {preview ? (
          <>
            <img
              // @ts-ignore
              src={preview}
              className={`preview-image ${disabled ? 'disabled' : ''}`}
              alt=""
              style={{
                opacity: `${enable ? '0.4' : '1'}`,
              }}
              onMouseOver={() => !disabled && setEnable(true)}
              onMouseOut={() => setEnable(false)}
            />
            <AddPhotoAlternateIcon
              sx={{
                position: 'absolute',
                top: 'calc((100% - 35px) / 2)',
                left: 'calc((100% - 35px) / 2)',
                display: `${enable ? 'inline-block' : 'none'}`,
              }}
              fontSize="large"
              onMouseOver={() => !disabled && setEnable(true)}
              onMouseOut={() => setEnable(false)}
            />
          </>
        ) : (
          <AddPhotoAlternateIcon fontSize="large" />
        )}
      </button>

      <input
        type="file"
        accept="image/*"
        hidden
        // @ts-ignore
        ref={inputRef}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
};

export default ControllerImageField;
