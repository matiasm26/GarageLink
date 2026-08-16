import { Platform } from 'react-native';

import { persistServiceImage } from '../imageService';

type MockDirectoryInput = {
  uri: string;
};

type MockFileDestination = {
  uri: string;
};

const mockCreateDirectory = jest.fn<void, [unknown?]>();
const mockCopyFile = jest.fn<Promise<void>, [MockFileDestination]>();
const mockCreatedFileUris: string[] = [];

jest.mock('expo-file-system', () => {
  class MockDirectory {
    uri: string;

    constructor(parent: MockDirectoryInput, name: string) {
      this.uri = `${parent.uri}/${name}`;
    }

    create(options?: unknown): void {
      mockCreateDirectory(options);
    }
  }

  class MockFile {
    uri: string;

    constructor(source: string | MockDirectory, name?: string) {
      if (typeof source === 'string') {
        this.uri = source;
      } else {
        this.uri = `${source.uri}/${name ?? 'file'}`;
      }

      mockCreatedFileUris.push(this.uri);
    }

    async copy(destination: MockFileDestination): Promise<void> {
      await mockCopyFile(destination);
    }
  }

  return {
    Directory: MockDirectory,
    File: MockFile,
    Paths: {
      document: {
        uri: 'file://document',
      },
    },
  };
});

describe('imageService', () => {
  let platformOS = 'ios';

  beforeAll(() => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: () => platformOS,
    });
  });

  beforeEach(() => {
    platformOS = 'ios';
    mockCreateDirectory.mockReset();
    mockCopyFile.mockReset();
    mockCreatedFileUris.length = 0;
  });

  test('copia imágenes nativas al directorio persistente de documentos', async () => {
    mockCopyFile.mockResolvedValue(undefined);

    const result = await persistServiceImage('file://cache/foto-temporal.png');

    expect(mockCreateDirectory).toHaveBeenCalledWith({ idempotent: true, intermediates: true });
    expect(mockCopyFile).toHaveBeenCalledWith(
      expect.objectContaining({
        uri: expect.stringMatching(/^file:\/\/document\/garagelink-service-images\/service-image-\d+\.png$/),
      }),
    );
    expect(result).toEqual({
      status: 'success',
      uri: expect.stringMatching(/^file:\/\/document\/garagelink-service-images\/service-image-\d+\.png$/),
    });
    expect(mockCreatedFileUris).toContain('file://cache/foto-temporal.png');
  });

  test('devuelve la URI original en web para mantener compatibilidad', async () => {
    platformOS = 'web';

    await expect(persistServiceImage('data:image/png;base64,abc123')).resolves.toEqual({
      status: 'success',
      uri: 'data:image/png;base64,abc123',
    });
    expect(mockCreateDirectory).not.toHaveBeenCalled();
    expect(mockCopyFile).not.toHaveBeenCalled();
  });

  test('devuelve error si no puede copiar la imagen', async () => {
    mockCopyFile.mockRejectedValue(new Error('copy failed'));

    await expect(persistServiceImage('file://cache/foto-temporal.jpg')).resolves.toEqual({
      status: 'error',
      message: 'No se pudo guardar la foto de forma persistente.',
    });
  });

  test('usa jpg cuando la URI no tiene extensión', async () => {
    mockCopyFile.mockResolvedValue(undefined);

    const result = await persistServiceImage('file://cache/foto-temporal');

    expect(result).toEqual({
      status: 'success',
      uri: expect.stringMatching(/^file:\/\/document\/garagelink-service-images\/service-image-\d+\.jpg$/),
    });
  });
});
