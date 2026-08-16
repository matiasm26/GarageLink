import AsyncStorage from '@react-native-async-storage/async-storage';

import { loadServiceRecords, saveServiceRecords } from '../storageService';
import type { ServiceRecord } from '../../types/serviceRecord';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const asyncStorageMock = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

const serviceRecord: ServiceRecord = {
  createdAt: '2026-08-15T12:00:00.000Z',
  description: 'Servicio de prueba',
  id: 'service-1',
  status: 'pendiente',
  synced: false,
  title: 'Cambio de aceite',
};

describe('storageService', () => {
  beforeEach(() => {
    asyncStorageMock.getItem.mockReset();
    asyncStorageMock.setItem.mockReset();
  });

  test('carga una lista vacía cuando no hay registros guardados', async () => {
    asyncStorageMock.getItem.mockResolvedValue(null);

    await expect(loadServiceRecords()).resolves.toEqual([]);
  });

  test('guarda registros serializados en AsyncStorage', async () => {
    asyncStorageMock.setItem.mockResolvedValue(undefined);

    await saveServiceRecords([serviceRecord]);

    expect(asyncStorageMock.setItem).toHaveBeenCalledWith('@garagelink/service-records', JSON.stringify([serviceRecord]));
  });

  test('carga registros válidos desde AsyncStorage', async () => {
    asyncStorageMock.getItem.mockResolvedValue(JSON.stringify([serviceRecord]));

    await expect(loadServiceRecords()).resolves.toEqual([serviceRecord]);
  });

  test('carga registros válidos con imageUri persistente', async () => {
    const recordWithPersistentImage: ServiceRecord = {
      ...serviceRecord,
      imageUri: 'file://document/garagelink-service-images/service-image-1.jpg',
    };

    asyncStorageMock.getItem.mockResolvedValue(JSON.stringify([recordWithPersistentImage]));

    await expect(loadServiceRecords()).resolves.toEqual([recordWithPersistentImage]);
  });

  test('rechaza datos guardados que no son una lista', async () => {
    asyncStorageMock.getItem.mockResolvedValue(JSON.stringify({ id: 'service-1' }));

    await expect(loadServiceRecords()).rejects.toThrow('formato válido');
  });

  test('ignora elementos inválidos dentro de una lista guardada', async () => {
    asyncStorageMock.getItem.mockResolvedValue(JSON.stringify([serviceRecord, { id: 123 }]));

    await expect(loadServiceRecords()).resolves.toEqual([serviceRecord]);
  });
});
