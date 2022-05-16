import { useState, useCallback, useEffect } from 'react';

const useForceUpdate = () => {
  const [state, setState] = useState<object>({});

  const handleForceUpdate = useCallback(() => {
    setState({});
  }, []);

  return [state, handleForceUpdate] as const;
};

export default useForceUpdate;
