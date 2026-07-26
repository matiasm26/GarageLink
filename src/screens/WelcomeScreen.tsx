import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';

type WelcomeScreenProps = {
  onStart: () => void;
};

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>GL</Text>
        </View>

        <Text style={styles.title}>GarageLink</Text>
        <Text style={styles.subtitle}>Tu taller, tus clientes y tus servicios en un solo lugar.</Text>

        <View style={styles.featureList}>
          <Text style={styles.feature}>Agenda servicios de forma simple.</Text>
          <Text style={styles.feature}>Mantén contacto claro con tus clientes.</Text>
          <Text style={styles.feature}>Organiza el trabajo diario del taller.</Text>
        </View>

        <PrimaryButton title="Comenzar" onPress={onStart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  badge: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: 18,
    width: 56,
  },
  badgeText: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '800',
  },
  title: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 24,
    textAlign: 'center',
  },
  featureList: {
    gap: 10,
    marginBottom: 28,
  },
  feature: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
