import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ServiceLocation, ServiceRecord, ServiceStatus } from '../types/serviceRecord';

const SERVICE_RECORDS_KEY = '@garagelink/service-records';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isServiceStatus(value: unknown): value is ServiceStatus {
  return value === 'pendiente' || value === 'en_proceso' || value === 'completado';
}

function isServiceLocation(value: unknown): value is ServiceLocation {
  if (!isPlainObject(value)) {
    return false;
  }

  return typeof value.latitude === 'number' && typeof value.longitude === 'number';
}

function isServiceRecord(value: unknown): value is ServiceRecord {
  if (!isPlainObject(value)) {
    return false;
  }

  const location = value.location;
  const imageUri = value.imageUri;

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    isServiceStatus(value.status) &&
    typeof value.createdAt === 'string' &&
    typeof value.synced === 'boolean' &&
    (imageUri === undefined || typeof imageUri === 'string') &&
    (location === undefined || isServiceLocation(location))
  );
}

export async function loadServiceRecords(): Promise<ServiceRecord[]> {
  const storedRecords = await AsyncStorage.getItem(SERVICE_RECORDS_KEY);

  if (storedRecords === null) {
    return [];
  }

  const parsedRecords: unknown = JSON.parse(storedRecords);

  if (!Array.isArray(parsedRecords)) {
    throw new Error('Los registros guardados no tienen un formato válido.');
  }

  return parsedRecords.filter(isServiceRecord);
}

export async function saveServiceRecords(records: ServiceRecord[]): Promise<void> {
  await AsyncStorage.setItem(SERVICE_RECORDS_KEY, JSON.stringify(records));
}
