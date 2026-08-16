import * as Location from 'expo-location';

import { requestCurrentServiceLocation } from '../locationService';

type MockLocationObject = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

type MockPermissionResponse = {
  status: string;
};

type MockedLocationModule = {
  getCurrentPositionAsync: jest.Mock<Promise<MockLocationObject>, [object?]>;
  requestForegroundPermissionsAsync: jest.Mock<Promise<MockPermissionResponse>, []>;
};

jest.mock('expo-location', () => ({
  getCurrentPositionAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
}));

const locationMock = Location as unknown as MockedLocationModule;

describe('locationService', () => {
  beforeEach(() => {
    locationMock.getCurrentPositionAsync.mockReset();
    locationMock.requestForegroundPermissionsAsync.mockReset();
  });

  test('devuelve coordenadas cuando el permiso GPS es concedido', async () => {
    locationMock.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    locationMock.getCurrentPositionAsync.mockResolvedValue({
      coords: {
        latitude: -33.4489,
        longitude: -70.6693,
      },
    });

    await expect(requestCurrentServiceLocation()).resolves.toEqual({
      location: {
        latitude: -33.4489,
        longitude: -70.6693,
      },
      message: 'Ubicación guardada para este servicio.',
      status: 'granted',
    });
  });

  test('devuelve estado denegado y no consulta coordenadas sin permiso', async () => {
    locationMock.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });

    await expect(requestCurrentServiceLocation()).resolves.toEqual({
      message: 'Permiso de ubicación denegado. Puedes guardar el servicio sin GPS.',
      status: 'denied',
    });
    expect(locationMock.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  test('devuelve error cuando falla la obtención de ubicación', async () => {
    locationMock.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    locationMock.getCurrentPositionAsync.mockRejectedValue(new Error('GPS unavailable'));

    await expect(requestCurrentServiceLocation()).resolves.toEqual({
      message: 'No se pudo obtener la ubicación. Puedes guardar el servicio sin GPS.',
      status: 'error',
    });
  });
});
