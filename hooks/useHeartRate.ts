import { useState, useCallback, useEffect, useRef } from 'react';

export interface HeartRateData {
  heartRate: number;
  rrIntervals: number[];
  timestamp: number;
}

export interface UseHeartRateReturn {
  isConnected: boolean;
  isConnecting: boolean;
  heartRateData: HeartRateData | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  deviceName: string | null;
}

const HEART_RATE_SERVICE_UUID = 0x180d;
const HEART_RATE_MEASUREMENT_CHARACTERISTIC_UUID = 0x2a37;

export function useHeartRate(): UseHeartRateReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [heartRateData, setHeartRateData] = useState<HeartRateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);

  const deviceRef = useRef<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

  const parseHeartRateData = useCallback((value: DataView): HeartRateData => {
    const flags = value.getUint8(0);
    const is16Bit = flags & 0x01;
    let heartRate: number;
    let offset: number;

    if (is16Bit) {
      heartRate = value.getUint16(1, true);
      offset = 3;
    } else {
      heartRate = value.getUint8(1);
      offset = 2;
    }

    const rrIntervals: number[] = [];
    const rrPresent = flags & 0x10;

    if (rrPresent) {
      for (let i = offset; i < value.byteLength; i += 2) {
        if (i + 1 < value.byteLength) {
          const rrValue = value.getUint16(i, true);
          // RR intervals are in 1/1024 seconds, convert to milliseconds
          rrIntervals.push((rrValue * 1000) / 1024);
        }
      }
    }

    return {
      heartRate,
      rrIntervals,
      timestamp: Date.now(),
    };
  }, []);

  const handleCharacteristicValueChanged = useCallback(
    (event: Event) => {
      const target = event.target as BluetoothRemoteGATTCharacteristic;
      const value = target.value;
      if (value) {
        const data = parseHeartRateData(value);
        setHeartRateData(data);
        setError(null);
      }
    },
    [parseHeartRateData]
  );

  const handleDisconnection = useCallback(() => {
    setIsConnected(false);
    setDeviceName(null);
    setError('Device disconnected');

    if (characteristicRef.current) {
      characteristicRef.current.removeEventListener(
        'characteristicvaluechanged',
        handleCharacteristicValueChanged
      );
      characteristicRef.current = null;
    }
  }, [handleCharacteristicValueChanged]);

  const connect = useCallback(async () => {
    if (!navigator.bluetooth) {
      setError('Web Bluetooth API is not available in this browser');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [HEART_RATE_SERVICE_UUID] }],
        optionalServices: [HEART_RATE_SERVICE_UUID],
      });

      if (!device.gatt) {
        throw new Error('GATT not available on device');
      }

      deviceRef.current = device;
      setDeviceName(device.name || 'Unknown Device');

      device.addEventListener('gattserverdisconnected', handleDisconnection);

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(HEART_RATE_SERVICE_UUID);
      const characteristic = await service.getCharacteristic(
        HEART_RATE_MEASUREMENT_CHARACTERISTIC_UUID
      );

      characteristicRef.current = characteristic;

      await characteristic.startNotifications();
      characteristic.addEventListener(
        'characteristicvaluechanged',
        handleCharacteristicValueChanged
      );

      setIsConnected(true);
      setIsConnecting(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to connect: ${errorMessage}`);
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, [handleCharacteristicValueChanged, handleDisconnection]);

  const disconnect = useCallback(() => {
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    handleDisconnection();
  }, [handleDisconnection]);

  useEffect(() => {
    return () => {
      if (deviceRef.current?.gatt?.connected) {
        deviceRef.current.gatt.disconnect();
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    heartRateData,
    error,
    connect,
    disconnect,
    deviceName,
  };
}
