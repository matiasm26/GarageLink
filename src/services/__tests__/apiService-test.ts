import { importServiceRecordsFromApi, syncServiceRecordsWithApi } from '../apiService';
import type { ServiceRecord } from '../../types/serviceRecord';

const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>();
globalThis.fetch = fetchMock as typeof fetch;

function jsonResponse(ok: boolean, status: number, payload: unknown): Response {
  const response = {
    json: jest.fn(async () => payload),
    ok,
    status,
  };

  return response as unknown as Response;
}

const localRecord: ServiceRecord = {
  createdAt: '2026-08-15T12:00:00.000Z',
  description: 'Servicio local',
  id: 'service-1',
  status: 'pendiente',
  synced: false,
  title: 'Servicio local',
};

describe('apiService', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  test('importa y mapea registros válidos desde la API', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(true, 200, [
        {
          completed: false,
          id: 1,
          title: 'delectus aut autem',
          userId: 1,
        },
      ]),
    );

    await expect(importServiceRecordsFromApi()).resolves.toEqual({
      invalidCount: 0,
      records: [
        expect.objectContaining({
          description: 'Registro importado desde JSONPlaceholder para usuario 1.',
          id: 'api-1',
          status: 'pendiente',
          synced: true,
          title: 'delectus aut autem',
        }),
      ],
    });
  });

  test('cuenta e ignora datos externos inválidos', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(true, 200, [
        {
          completed: true,
          id: 2,
          title: 'servicio externo válido',
          userId: 1,
        },
        {
          completed: 'no',
          id: 'bad',
        },
      ]),
    );

    await expect(importServiceRecordsFromApi()).resolves.toMatchObject({
      invalidCount: 1,
      records: [
        {
          id: 'api-2',
          status: 'completado',
          synced: true,
          title: 'servicio externo válido',
        },
      ],
    });
  });

  test('rechaza errores HTTP durante importación', async () => {
    fetchMock.mockResolvedValue(jsonResponse(false, 500, []));

    await expect(importServiceRecordsFromApi()).rejects.toThrow('HTTP 500');
  });

  test('rechaza respuestas de importación que no son listas', async () => {
    fetchMock.mockResolvedValue(jsonResponse(true, 200, { id: 1 }));

    await expect(importServiceRecordsFromApi()).rejects.toThrow('datos inválidos');
  });

  test('propaga errores de red durante importación', async () => {
    fetchMock.mockRejectedValue(new Error('Network down'));

    await expect(importServiceRecordsFromApi()).rejects.toThrow('Network down');
  });

  test('sincroniza registros y valida la respuesta remota', async () => {
    fetchMock.mockResolvedValue(jsonResponse(true, 201, { id: 101 }));

    await expect(syncServiceRecordsWithApi([localRecord])).resolves.toEqual({
      remoteId: 101,
    });
  });

  test('rechaza respuestas inválidas de sincronización', async () => {
    fetchMock.mockResolvedValue(jsonResponse(true, 201, { id: 'bad' }));

    await expect(syncServiceRecordsWithApi([localRecord])).rejects.toThrow('sincronización inválida');
  });
});
