import { forwardRef, useImperativeHandle } from 'react';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type CameraPermission = {
  granted: boolean;
} | null;

type CameraPictureOptions = {
  quality?: number;
};

type CameraPicture = {
  uri?: string;
};

type CameraViewHandle = {
  takePictureAsync: (options?: CameraPictureOptions) => Promise<CameraPicture | undefined>;
};

type CameraViewProps = {
  children?: ReactNode;
  facing?: string;
  style?: unknown;
};

let cameraPermission: CameraPermission = { granted: false };

export const mockRequestCameraPermission = jest.fn<Promise<{ granted: boolean }>, []>();
export const mockTakePictureAsync = jest.fn<Promise<CameraPicture | undefined>, [CameraPictureOptions?]>();

export function setMockCameraPermission(nextPermission: CameraPermission): void {
  cameraPermission = nextPermission;
}

export function resetMockCamera(): void {
  cameraPermission = { granted: false };
  mockRequestCameraPermission.mockReset();
  mockTakePictureAsync.mockReset();
}

export const CameraView = forwardRef<CameraViewHandle, CameraViewProps>(function MockCameraView(_props, ref) {
  useImperativeHandle(ref, () => ({
    takePictureAsync: mockTakePictureAsync,
  }));

  return <View testID="camera-view" />;
});

export function useCameraPermissions(): readonly [CameraPermission, typeof mockRequestCameraPermission] {
  return [cameraPermission, mockRequestCameraPermission] as const;
}
