import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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

  const handleSubmit = () => {
    const nextErrors = validateServiceForm(title, description);

    if (nextErrors.title || nextErrors.description) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      description: description.trim(),
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
});
