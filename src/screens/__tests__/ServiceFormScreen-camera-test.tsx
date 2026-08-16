import { fireEvent, render, waitFor } from '@testing-library/react-native';

import {
  mockRequestCameraPermission,
  mockTakePictureAsync,
  resetMockCamera,
  setMockCameraPermission,
} from '../../../__mocks__/expo-camera';
import { ServiceFormScreen } from '../ServiceFormScreen';
import type { ServiceRecordInput } from '../../types/serviceRecord';

jest.mock('expo-camera', () => jest.requireActual('../../../__mocks__/expo-camera'));

describe('ServiceFormScreen camera flow', () => {
  beforeEach(() => {
    resetMockCamera();
  });

  test('muestra la sección de foto opcional', async () => {
    const onCancel = jest.fn();
    const onSubmit = jest.fn<void, [ServiceRecordInput]>();

    const screen = await render(<ServiceFormScreen onCancel={onCancel} onSubmit={onSubmit} />);

    await screen.findByText('Foto del servicio');
    await screen.findByText('Tomar foto');
  });

  test('permite guardar sin foto cuando el permiso de cámara es denegado', async () => {
    const onCancel = jest.fn();
    const onSubmit = jest.fn<void, [ServiceRecordInput]>();
    mockRequestCameraPermission.mockResolvedValue({ granted: false });
    setMockCameraPermission({ granted: false });

    const screen = await render(<ServiceFormScreen onCancel={onCancel} onSubmit={onSubmit} />);
    const titleInput = await screen.findByPlaceholderText('Ej: Cambio de aceite');
    const descriptionInput = await screen.findByPlaceholderText('Describe brevemente el trabajo');

    await fireEvent.changeText(titleInput, 'Servicio sin cámara');
    await fireEvent.changeText(descriptionInput, 'La cámara fue denegada');
    await fireEvent.press(await screen.findByText('Tomar foto'));
    await fireEvent.press(await screen.findByText('Permitir cámara'));

    await waitFor(() => {
      screen.getByText('Permiso de cámara denegado. Puedes guardar el servicio sin foto.');
    });

    await fireEvent.press(screen.getByText('Guardar servicio'));

    const submitted = onSubmit.mock.calls[0]?.[0];
    expect(submitted?.title).toBe('Servicio sin cámara');
    expect(submitted?.imageUri).toBeUndefined();
  });

  test('asocia imageUri cuando la captura de cámara es exitosa', async () => {
    const onCancel = jest.fn();
    const onSubmit = jest.fn<void, [ServiceRecordInput]>();
    setMockCameraPermission({ granted: true });
    mockTakePictureAsync.mockResolvedValue({ uri: 'file://foto-servicio.jpg' });

    const screen = await render(<ServiceFormScreen onCancel={onCancel} onSubmit={onSubmit} />);
    const titleInput = await screen.findByPlaceholderText('Ej: Cambio de aceite');
    const descriptionInput = await screen.findByPlaceholderText('Describe brevemente el trabajo');

    await fireEvent.changeText(titleInput, 'Servicio con cámara');
    await fireEvent.changeText(descriptionInput, 'La cámara capturó una imagen');
    await fireEvent.press(await screen.findByText('Tomar foto'));
    await fireEvent.press(await screen.findByText('Capturar'));

    await waitFor(() => {
      screen.getByText('Foto asociada al servicio.');
    });

    await fireEvent.press(screen.getByText('Guardar servicio'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        imageUri: 'file://foto-servicio.jpg',
        title: 'Servicio con cámara',
      }),
    );
  });

  test('mantiene el guardado disponible si falla la captura', async () => {
    const onCancel = jest.fn();
    const onSubmit = jest.fn<void, [ServiceRecordInput]>();
    setMockCameraPermission({ granted: true });
    mockTakePictureAsync.mockRejectedValue(new Error('Camera unavailable'));

    const screen = await render(<ServiceFormScreen onCancel={onCancel} onSubmit={onSubmit} />);
    const titleInput = await screen.findByPlaceholderText('Ej: Cambio de aceite');
    const descriptionInput = await screen.findByPlaceholderText('Describe brevemente el trabajo');

    await fireEvent.changeText(titleInput, 'Servicio con error cámara');
    await fireEvent.changeText(descriptionInput, 'La cámara falló');
    await fireEvent.press(await screen.findByText('Tomar foto'));
    await fireEvent.press(await screen.findByText('Capturar'));

    await waitFor(() => {
      screen.getByText('No se pudo tomar la foto. Puedes guardar el servicio sin imagen.');
    });

    await fireEvent.press(screen.getByText('Guardar servicio'));

    const submitted = onSubmit.mock.calls[0]?.[0];
    expect(submitted?.title).toBe('Servicio con error cámara');
    expect(submitted?.imageUri).toBeUndefined();
  });
});
