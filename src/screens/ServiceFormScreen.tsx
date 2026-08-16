import { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { requestCurrentServiceLocation } from '../services/locationService';
import { colors } from '../theme/colors';
import type { ServiceLocation, ServiceRecordInput, ServiceStatus } from '../types/serviceRecord';
import { serviceStatusLabels } from '../types/serviceRecord';

type ServiceFormScreenProps = {
  onCancel: () => void;
  onSubmit: (input: ServiceRecordInput) => void;
};

type ServiceFormErrors = {
  title?: string;
  description?: string;
};

type LocationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'error';

const statusOptions: ServiceStatus[] = ['pendiente', 'en_proceso', 'completado'];

function validateServiceForm(title: string, description: string): ServiceFormErrors {
  const errors: ServiceFormErrors = {};

  if (title.trim().length === 0) {
    errors.title = 'Ingresa el título del servicio.';
  }

  if (description.trim().length === 0) {
    errors.description = 'Ingresa una descripción breve.';
  }

  return errors;
}

export function ServiceFormScreen({ onCancel, onSubmit }: ServiceFormScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ServiceStatus>('pendiente');
  const [errors, setErrors] = useState<ServiceFormErrors>({});
  const [location, setLocation] = useState<ServiceLocation | undefined>(undefined);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
  const [locationMessage, setLocationMessage] = useState('La ubicación es opcional y se solicitará solo al pulsar el botón.');
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [cameraMessage, setCameraMessage] = useState('La foto es opcional y se solicitará permiso al usar la cámara.');
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setErrors((currentErrors) => ({ ...currentErrors, title: undefined }));
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setErrors((currentErrors) => ({ ...currentErrors, description: undefined }));
  };

  const handleLocationPress = async () => {
    setLocationStatus('loading');
    setLocationMessage('Solicitando permiso y ubicación del dispositivo...');

    const result = await requestCurrentServiceLocation();

    setLocationStatus(result.status);
    setLocationMessage(result.message);

    if (result.status === 'granted') {
      setLocation(result.location);
      return;
    }

    setLocation(undefined);
  };

  const handleOpenCamera = () => {
    setIsCameraVisible(true);
    setCameraMessage('Prepara la cámara para asociar una foto al servicio.');
  };

  const handleRequestCameraPermission = async () => {
    setCameraMessage('Solicitando permiso de cámara...');

    const permission = await requestCameraPermission();

    if (permission.granted) {
      setCameraMessage('Permiso concedido. Puedes tomar la foto del servicio.');
      return;
    }

    setCameraMessage('Permiso de cámara denegado. Puedes guardar el servicio sin foto.');
  };

  const handleTakePhoto = async () => {
    const camera = cameraRef.current;

    if (!camera) {
      setCameraMessage('La cámara aún no está lista. Intenta nuevamente.');
      return;
    }

    setIsTakingPhoto(true);
    setCameraMessage('Tomando foto...');

    try {
      const photo = await camera.takePictureAsync({ quality: 0.7 });

      if (!photo?.uri) {
        setCameraMessage('No se pudo obtener la foto. Puedes guardar el servicio sin imagen.');
        return;
      }

      setImageUri(photo.uri);
      setIsCameraVisible(false);
      setCameraMessage('Foto asociada al servicio.');
    } catch {
      setCameraMessage('No se pudo tomar la foto. Puedes guardar el servicio sin imagen.');
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const handleSubmit = () => {
    const nextErrors = validateServiceForm(title, description);

    if (nextErrors.title || nextErrors.description) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      description: description.trim(),
      imageUri,
      location,
      status,
      title: title.trim(),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Pressable style={styles.backButton} onPress={onCancel}>
          <Text style={styles.backButtonText}>Cancelar</Text>
        </Pressable>

        <Text style={styles.title}>Nuevo servicio</Text>
        <Text style={styles.subtitle}>Crea un registro básico en memoria para preparar las funciones de U2.</Text>

        <View style={styles.form}>
          <FormInput
            error={errors.title}
            label="Título"
            onChangeText={handleTitleChange}
            placeholder="Ej: Cambio de aceite"
            value={title}
          />

          <FormInput
            error={errors.description}
            label="Descripción"
            onChangeText={handleDescriptionChange}
            placeholder="Describe brevemente el trabajo"
            value={description}
          />

          <View style={styles.statusSection}>
            <Text style={styles.statusLabel}>Estado</Text>
            <View style={styles.statusOptions}>
              {statusOptions.map((option) => (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.statusOption,
                    status === option ? styles.statusOptionSelected : null,
                    pressed ? styles.statusOptionPressed : null,
                  ]}
                  onPress={() => setStatus(option)}
                >
                  <Text style={[styles.statusOptionText, status === option ? styles.statusOptionTextSelected : null]}>
                    {serviceStatusLabels[option]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.locationSection}>
            <Text style={styles.statusLabel}>Ubicación GPS</Text>
            <Text style={styles.locationHelp}>Guarda latitud y longitud del servicio si el usuario concede permiso.</Text>
            <Pressable
              disabled={locationStatus === 'loading'}
              style={({ pressed }) => [
                styles.locationButton,
                pressed ? styles.locationButtonPressed : null,
                locationStatus === 'loading' ? styles.locationButtonDisabled : null,
              ]}
              onPress={handleLocationPress}
            >
              <Text style={styles.locationButtonText}>Obtener ubicación</Text>
            </Pressable>
            <Text
              style={[
                styles.locationMessage,
                locationStatus === 'granted' ? styles.locationMessageSuccess : null,
                locationStatus === 'denied' || locationStatus === 'error' ? styles.locationMessageError : null,
              ]}
            >
              {locationMessage}
            </Text>
            {location ? (
              <Text style={styles.locationCoordinates}>
                Latitud: {location.latitude.toFixed(5)} | Longitud: {location.longitude.toFixed(5)}
              </Text>
            ) : null}
          </View>

          <View style={styles.cameraSection}>
            <Text style={styles.statusLabel}>Foto del servicio</Text>
            <Text style={styles.locationHelp}>Captura una imagen opcional y asóciala al registro.</Text>
            {imageUri ? <Image source={{ uri: imageUri }} style={styles.photoPreview} /> : null}
            <Pressable style={({ pressed }) => [styles.locationButton, pressed ? styles.locationButtonPressed : null]} onPress={handleOpenCamera}>
              <Text style={styles.locationButtonText}>{imageUri ? 'Cambiar foto' : 'Tomar foto'}</Text>
            </Pressable>

            {isCameraVisible ? (
              <View style={styles.cameraBox}>
                {!cameraPermission ? <Text style={styles.locationMessage}>Cargando permisos de cámara...</Text> : null}

                {cameraPermission && !cameraPermission.granted ? (
                  <View style={styles.cameraPermissionBox}>
                    <Text style={styles.locationMessage}>GarageLink necesita permiso para abrir la cámara.</Text>
                    <Pressable style={styles.locationButton} onPress={handleRequestCameraPermission}>
                      <Text style={styles.locationButtonText}>Permitir cámara</Text>
                    </Pressable>
                  </View>
                ) : null}

                {cameraPermission?.granted ? (
                  <View style={styles.cameraPreviewBox}>
                    <CameraView ref={cameraRef} style={styles.cameraPreview} facing="back" />
                    <View style={styles.cameraActions}>
                      <Pressable
                        disabled={isTakingPhoto}
                        style={({ pressed }) => [
                          styles.locationButton,
                          pressed ? styles.locationButtonPressed : null,
                          isTakingPhoto ? styles.locationButtonDisabled : null,
                        ]}
                        onPress={handleTakePhoto}
                      >
                        <Text style={styles.locationButtonText}>{isTakingPhoto ? 'Tomando foto...' : 'Capturar'}</Text>
                      </Pressable>
                      <Pressable style={styles.closeCameraButton} onPress={() => setIsCameraVisible(false)}>
                        <Text style={styles.closeCameraButtonText}>Cerrar cámara</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}
              </View>
            ) : null}

            <Text
              style={[
                styles.locationMessage,
                imageUri ? styles.locationMessageSuccess : null,
                cameraMessage.includes('denegado') || cameraMessage.includes('No se pudo') ? styles.locationMessageError : null,
              ]}
            >
              {cameraMessage}
            </Text>
          </View>
        </View>

        <PrimaryButton title="Guardar servicio" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1,
    gap: 18,
    padding: 28,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  title: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 25,
  },
  form: {
    gap: 18,
  },
  statusSection: {
    gap: 10,
  },
  statusLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  statusOptions: {
    gap: 10,
  },
  statusOption: {
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusOptionPressed: {
    opacity: 0.82,
  },
  statusOptionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  statusOptionTextSelected: {
    color: colors.card,
  },
  locationSection: {
    gap: 10,
  },
  locationHelp: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  locationButton: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationButtonPressed: {
    opacity: 0.82,
  },
  locationButtonDisabled: {
    opacity: 0.56,
  },
  locationButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  locationMessage: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  locationMessageSuccess: {
    color: colors.success,
    fontWeight: '700',
  },
  locationMessageError: {
    color: colors.error,
    fontWeight: '700',
  },
  locationCoordinates: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  cameraSection: {
    gap: 10,
  },
  photoPreview: {
    borderRadius: 16,
    height: 180,
    width: '100%',
  },
  cameraBox: {
    gap: 12,
  },
  cameraPermissionBox: {
    gap: 10,
  },
  cameraPreviewBox: {
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cameraPreview: {
    height: 280,
    width: '100%',
  },
  cameraActions: {
    backgroundColor: colors.card,
    gap: 10,
    padding: 12,
  },
  closeCameraButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  closeCameraButtonText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
});
