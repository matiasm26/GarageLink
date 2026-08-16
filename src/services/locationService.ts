import * as Location from 'expo-location';

import type { ServiceLocation } from '../types/serviceRecord';

export type LocationRequestResult =
  | {
      location: ServiceLocation;
      message: string;
      status: 'granted';
    }
  | {
      message: string;
      status: 'denied' | 'error';
    };

export async function requestCurrentServiceLocation(): Promise<LocationRequestResult> {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== 'granted') {
      return {
        message: 'Permiso de ubicación denegado. Puedes guardar el servicio sin GPS.',
        status: 'denied',
      };
    }

    const currentLocation = await Location.getCurrentPositionAsync({});

    return {
      location: {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      },
      message: 'Ubicación guardada para este servicio.',
      status: 'granted',
    };
  } catch {
    return {
      message: 'No se pudo obtener la ubicación. Puedes guardar el servicio sin GPS.',
      status: 'error',
    };
  }
}
