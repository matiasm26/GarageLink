import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import type { ServiceRecordInput, ServiceStatus } from '../types/serviceRecord';
import { serviceStatusLabels } from '../types/serviceRecord';

type ServiceFormScreenProps = {
  onCancel: () => void;
  onSubmit: (input: ServiceRecordInput) => void;
};

type ServiceFormErrors = {
  title?: string;
  description?: string;
};

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

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setErrors((currentErrors) => ({ ...currentErrors, title: undefined }));
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setErrors((currentErrors) => ({ ...currentErrors, description: undefined }));
  };

  const handleSubmit = () => {
    const nextErrors = validateServiceForm(title, description);

    if (nextErrors.title || nextErrors.description) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      description: description.trim(),
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
});
