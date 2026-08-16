import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import type { ServiceRecord } from '../types/serviceRecord';
import { serviceStatusLabels } from '../types/serviceRecord';

type ServiceListScreenProps = {
  records: ServiceRecord[];
  onCreateNew: () => void;
  onLogout: () => void;
};


export function ServiceListScreen({ records, onCreateNew, onLogout }: ServiceListScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <Pressable style={styles.backButton} onPress={onLogout}>
          <Text style={styles.backButtonText}>Cerrar sesión</Text>
        </Pressable>

        <Text style={styles.title}>Servicios del taller</Text>
        <Text style={styles.subtitle}>Registra y revisa las tareas de GarageLink para la Evaluación U2.</Text>

        <PrimaryButton title="Nuevo servicio" onPress={onCreateNew} />
      </View>

      {records.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin registros todavía</Text>
          <Text style={styles.emptyText}>Crea el primer servicio para comenzar el flujo U2 en memoria.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {records.map((record) => (
            <View key={record.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <Text style={styles.recordTitle}>{record.title}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{serviceStatusLabels[record.status]}</Text>
                </View>
              </View>

              <Text style={styles.recordDescription}>{record.description}</Text>
              <Text style={styles.recordMeta}>Creado: {new Date(record.createdAt).toLocaleDateString('es-CL')}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexGrow: 1,
    gap: 18,
    padding: 24,
  },
  headerCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1,
    gap: 16,
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
  emptyCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    padding: 22,
  },
  emptyTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  list: {
    gap: 14,
  },
  recordCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    padding: 20,
  },
  recordHeader: {
    alignItems: 'flex-start',
    gap: 10,
  },
  recordTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  statusBadge: {
    backgroundColor: colors.successBackground,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '800',
  },
  recordDescription: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  recordMeta: {
    color: colors.muted,
    fontSize: 13,
  },
});
