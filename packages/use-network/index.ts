import { useState, useEffect } from 'react';

export type Network = {
  online?: boolean;
  effectiveType?: string;
  rtt?: number;
  type?: string;
  downlink?: number;
  saveData?: boolean;
  downlinkMax?: number;
  lastChangeDate?: Date;
};

function getConnection() {
  const _navigator = navigator as any;
  return _navigator?.connection || _navigator?.mozConnection || _navigator?.webkitConnection;
}

function getCurrentNetwork(): Network {
  const connection = getConnection();
  if (!connection) {
    return {};
  }
  return {
    type: connection.type,
    saveData: connection.saveData,
    downlink: connection.downlink,
    downlinkMax: connection.downlinkMax,
    effectiveType: connection.effectiveType,
    rtt: connection.rtt,
  };
}

export default function useNetwork(): [Network] {
  const [state, setState] = useState<Network>(() => {
    return {
      ...getCurrentNetwork(),
      online: !!navigator?.onLine,
      lastChangeDate: new Date(),
    };
  });

  const handleOnline = () => {
    setState((prev) => ({
      ...prev,
      lastChangeDate: new Date(),
      online: true,
    }));
  };

  const handleOffline = () => {
    setState((prev) => ({
      ...prev,
      lastChangeDate: new Date(),
      online: false,
    }));
  };

  const handleChange = () => {
    setState((prev) => ({
      ...prev,
      ...getCurrentNetwork(),
      online: !!navigator?.onLine,
      lastChangeDate: new Date(),
    }));
  };

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    getConnection()?.addEventListener('change', handleChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      getConnection()?.removeEventListener('change', handleChange);
    };
  }, []);

  return [state];
}
