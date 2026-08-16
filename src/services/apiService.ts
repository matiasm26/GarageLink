import type { ServiceRecord, ServiceStatus } from '../types/serviceRecord';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';
const IMPORT_LIMIT = 5;

type ExternalTodo = {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
};

export type ImportServiceRecordsResult = {
  invalidCount: number;
  records: ServiceRecord[];
};

export type SyncServiceRecordsResult = {
  remoteId: number;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isExternalTodo(value: unknown): value is ExternalTodo {
  if (!isPlainObject(value)) {
    return false;
  }

  return (
    typeof value.completed === 'boolean' &&
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.userId === 'number'
  );
}

function statusFromExternalTodo(todo: ExternalTodo): ServiceStatus {
  if (todo.completed) {
    return 'completado';
  }

  return 'pendiente';
}

function recordFromExternalTodo(todo: ExternalTodo): ServiceRecord {
  return {
    createdAt: new Date().toISOString(),
    description: `Registro importado desde JSONPlaceholder para usuario ${todo.userId}.`,
    id: `api-${todo.id}`,
    status: statusFromExternalTodo(todo),
    synced: true,
    title: todo.title,
  };
}

export async function importServiceRecordsFromApi(): Promise<ImportServiceRecordsResult> {
  const response = await fetch(`${API_URL}?_limit=${IMPORT_LIMIT}`);

  if (!response.ok) {
    throw new Error(`La API respondió con HTTP ${response.status}.`);
  }

  const payload: unknown = await response.json();

  if (!Array.isArray(payload)) {
    throw new Error('La API entregó datos inválidos.');
  }

  const validTodos = payload.filter(isExternalTodo);

  if (validTodos.length === 0) {
    throw new Error('La API no entregó registros válidos para importar.');
  }

  return {
    invalidCount: payload.length - validTodos.length,
    records: validTodos.map(recordFromExternalTodo),
  };
}

export async function syncServiceRecordsWithApi(records: ServiceRecord[]): Promise<SyncServiceRecordsResult> {
  const response = await fetch(API_URL, {
    body: JSON.stringify({
      records: records.map((record) => ({
        completed: record.status === 'completado',
        id: record.id,
        title: record.title,
      })),
      title: 'GarageLink sync',
      userId: 1,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`La sincronización respondió con HTTP ${response.status}.`);
  }

  const payload: unknown = await response.json();

  if (!isPlainObject(payload) || typeof payload.id !== 'number') {
    throw new Error('La API entregó una respuesta de sincronización inválida.');
  }

  return {
    remoteId: payload.id,
  };
}
