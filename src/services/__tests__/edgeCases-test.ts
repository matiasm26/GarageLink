import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

import { loadServiceRecords, saveServiceRecords } from '../storageService';
import { importServiceRecordsFromApi, syncServiceRecordsWithApi } from '../apiService';
import { requestCurrentServiceLocation } from '../locationService';
import type { ServiceRecord } from '../../types/serviceRecord';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn(), setItem: jest.fn() },
}));
jest.mock('expo-location', () => ({
  getCurrentPositionAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const location = Location as unknown as {
  getCurrentPositionAsync: jest.Mock;
  requestForegroundPermissionsAsync: jest.Mock;
};
const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>();
globalThis.fetch = fetchMock as typeof fetch;

const record: ServiceRecord = {
  createdAt: '2026-08-15T12:00:00.000Z', description: 'Descripción', id: 'service-1',
  status: 'en_proceso', synced: false, title: 'Servicio',
  imageUri: 'file://image.jpg', location: { latitude: -33.4, longitude: -70.6 },
};

function response(ok: boolean, status: number, payload: unknown): Response {
  return { ok, status, json: jest.fn(async () => payload) } as unknown as Response;
}

describe('casos límite de servicios', () => {
  beforeEach(() => {
    storage.getItem.mockReset(); storage.setItem.mockReset();
    location.getCurrentPositionAsync.mockReset(); location.requestForegroundPermissionsAsync.mockReset();
    fetchMock.mockReset();
  });

  test('rechaza JSON de almacenamiento malformado y errores de escritura', async () => {
    storage.getItem.mockResolvedValue('{malformado');
    await expect(loadServiceRecords()).rejects.toThrow();
    storage.setItem.mockRejectedValue(new Error('storage unavailable'));
    await expect(saveServiceRecords([])).rejects.toThrow('storage unavailable');
  });

  test('filtra registros con estado o ubicación inválidos', async () => {
    storage.getItem.mockResolvedValue(JSON.stringify([record, { ...record, status: 'otro' }, { ...record, location: { latitude: 'bad', longitude: 1 } }]));
    await expect(loadServiceRecords()).resolves.toEqual([record]);
  });

  test('maneja permiso GPS rechazado por la API', async () => {
    location.requestForegroundPermissionsAsync.mockRejectedValue(new Error('permission error'));
    await expect(requestCurrentServiceLocation()).resolves.toEqual({
      status: 'error', message: 'No se pudo obtener la ubicación. Puedes guardar el servicio sin GPS.',
    });
  });

  test('rechaza una importación sin registros externos válidos', async () => {
    fetchMock.mockResolvedValue(response(true, 200, []));
    await expect(importServiceRecordsFromApi()).rejects.toThrow('registros válidos');
    fetchMock.mockResolvedValue(response(true, 200, [{ id: 1, title: 'bad', completed: 'no', userId: 1 }]));
    await expect(importServiceRecordsFromApi()).rejects.toThrow('registros válidos');
  });

  test('rechaza errores HTTP y respuestas inválidas durante sincronización', async () => {
    fetchMock.mockResolvedValue(response(false, 503, {}));
    await expect(syncServiceRecordsWithApi([record])).rejects.toThrow('HTTP 503');
    fetchMock.mockResolvedValue(response(true, 200, null));
    await expect(syncServiceRecordsWithApi([])).rejects.toThrow('sincronización inválida');
  });

  test('envía el payload de sincronización con estados transformados', async () => {
    fetchMock.mockResolvedValue(response(true, 201, { id: 42 }));
    await expect(syncServiceRecordsWithApi([record])).resolves.toEqual({ remoteId: 42 });
    expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos', expect.objectContaining({
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: [{ completed: false, id: 'service-1', title: 'Servicio' }], title: 'GarageLink sync', userId: 1 }),
    }));
  });
});
