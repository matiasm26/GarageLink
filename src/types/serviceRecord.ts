export type ServiceStatus = 'pendiente' | 'en_proceso' | 'completado';

export type ServiceLocation = {
  latitude: number;
  longitude: number;
};

export type ServiceRecord = {
  id: string;
  title: string;
  description: string;
  status: ServiceStatus;
  createdAt: string;
  imageUri?: string;
  location?: ServiceLocation;
  synced: boolean;
};

export type ServiceRecordInput = {
  title: string;
  description: string;
  status: ServiceStatus;
};

export const serviceStatusLabels: Record<ServiceStatus, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  completado: 'Completado',
};
