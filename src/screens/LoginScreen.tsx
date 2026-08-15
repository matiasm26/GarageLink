import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';

type LoginScreenProps = {
  onBack: () => void;
  onLoginSuccess: () => void;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  const cleanEmail = email.trim();

  if (cleanEmail.length === 0) {
    errors.email = 'Ingresa tu correo.';
  } else if (!emailPattern.test(cleanEmail)) {
    errors.email = 'Ingresa un correo válido.';
  }

  if (password.length === 0) {
    errors.password = 'Ingresa tu contraseña.';
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  }

  return errors;
}

export function LoginScreen({ onBack, onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setSuccessMessage('');
    setErrors((currentErrors) => ({ ...currentErrors, email: undefined }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setSuccessMessage('');
    setErrors((currentErrors) => ({ ...currentErrors, password: undefined }));
  };

  const handleSubmit = () => {
    const nextErrors = validateLogin(email, password);

    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      setSuccessMessage('');
      return;
    }

    setErrors({});
    setSuccessMessage('Formulario válido. Bienvenido a GarageLink.');
    onLoginSuccess();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>

        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.subtitle}>Ingresa tus datos para continuar con GarageLink.</Text>

        <View style={styles.form}>
          <FormInput
            autoCapitalize="none"
            error={errors.email}
            keyboardType="email-address"
            label="Correo"
            onChangeText={handleEmailChange}
            placeholder="correo@ejemplo.com"
            value={email}
          />

          <FormInput
            error={errors.password}
            label="Contraseña"
            onChangeText={handlePasswordChange}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            value={password}
          />
        </View>

        {successMessage ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        <PrimaryButton title="Ingresar" onPress={handleSubmit} />
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
    padding: 28,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 18,
    paddingVertical: 4,
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
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    gap: 16,
    marginBottom: 20,
  },
  successBox: {
    backgroundColor: colors.successBackground,
    borderColor: colors.success,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    padding: 14,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
});
