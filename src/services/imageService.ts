import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

const SERVICE_IMAGES_DIRECTORY = 'garagelink-service-images';
const DEFAULT_IMAGE_EXTENSION = 'jpg';

export type PersistServiceImageResult =
  | {
      status: 'success';
      uri: string;
    }
  | {
      status: 'error';
      message: string;
    };

function getImageExtension(uri: string): string {
  const pathWithoutQuery = uri.split('?')[0] ?? uri;
  const match = /\.([a-zA-Z0-9]+)$/.exec(pathWithoutQuery);

  return match?.[1]?.toLowerCase() ?? DEFAULT_IMAGE_EXTENSION;
}

function canCopyImageUri(uri: string): boolean {
  return uri.startsWith('file://') || uri.startsWith('/');
}

export async function persistServiceImage(sourceUri: string): Promise<PersistServiceImageResult> {
  if (Platform.OS === 'web' || !canCopyImageUri(sourceUri)) {
    return {
      status: 'success',
      uri: sourceUri,
    };
  }

  try {
    const imagesDirectory = new Directory(Paths.document, SERVICE_IMAGES_DIRECTORY);
    imagesDirectory.create({ idempotent: true, intermediates: true });

    const extension = getImageExtension(sourceUri);
    const destination = new File(imagesDirectory, `service-image-${Date.now()}.${extension}`);
    const source = new File(sourceUri);

    await source.copy(destination);

    return {
      status: 'success',
      uri: destination.uri,
    };
  } catch {
    return {
      status: 'error',
      message: 'No se pudo guardar la foto de forma persistente.',
    };
  }
}
