import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import type { ServiceRecord } from '../types/serviceRecord';
import { serviceStatusLabels } from '../types/serviceRecord';

type StorageStatus = 'loading' | 'ready' | 'error';
type ApiStatus = 'idle' | 'loading' | 'success' | 'error';


type ServiceListScreenProps = {
  apiMessage: string;
  apiStatus: ApiStatus;
  records: ServiceRecord[];
  onCreateNew: () => void;
  onImportFromApi: () => void;
  onSyncWithApi: () => void;
  onLogout: () => void;
  storageError: string;
  storageStatus: StorageStatus;
};


export function ServiceListScreen({
  apiMessage,
  apiStatus,
  records,
  onCreateNew,
  onImportFromApi,
  onLogout,
  onSyncWithApi,
  storageError,
  storageStatus,
}: ServiceListScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <Pressable style={styles.backButton} onPress={onLogout}>
          <Text style={styles.backButtonText}>Cerrar sesión</Text>
        </Pressable>

        <Text style={styles.title}>Servicios del taller</Text>
        <Text style={styles.subtitle}>Registra y revisa las tareas de GarageLink para la Evaluación U2.</Text>

        {storageStatus === 'loading' ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Cargando registros guardados...</Text>
          </View>
        ) : null}

        {storageStatus === 'error' ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{storageError}</Text>
          </View>
        ) : null}

        <View style={styles.apiBox}>
          <Text style={styles.apiTitle}>API externa</Text>
          <Text
            style={[
              styles.apiMessage,
              apiStatus === 'success' ? styles.apiMessageSuccess : null,
              apiStatus === 'error' ? styles.apiMessageError : null,
            ]}
          >
            {apiMessage}
          </Text>
          <View style={styles.apiActions}>
            <Pressable
              disabled={apiStatus === 'loading'}
              style={({ pressed }) => [
                styles.apiButton,
                pressed ? styles.apiButtonPressed : null,
                apiStatus === 'loading' ? styles.apiButtonDisabled : null,
              ]}
              onPress={onImportFromApi}
            >
              <Text style={styles.apiButtonText}>Importar API</Text>
            </Pressable>
            <Pressable
              disabled={apiStatus === 'loading'}
              style={({ pressed }) => [
                styles.apiButton,
                pressed ? styles.apiButtonPressed : null,
                apiStatus === 'loading' ? styles.apiButtonDisabled : null,
              ]}
              onPress={onSyncWithApi}
            >
              <Text style={styles.apiButtonText}>Sincronizar</Text>
            </Pressable>
          </View>
        </View>

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
              {record.imageUri ? <Image source={{ uri: record.imageUri }} style={styles.recordImage} /> : null}
              <Text style={styles.recordMeta}>Creado: {new Date(record.createdAt).toLocaleDateString('es-CL')}</Text>
              {record.location ? (
                <Text style={styles.recordMeta}>
                  Ubicación: {record.location.latitude.toFixed(5)}, {record.location.longitude.toFixed(5)}
                </Text>
              ) : null}
              <Text style={styles.recordMeta}>{record.synced ? 'Sincronizado con API' : 'Pendiente de sincronizar'}</Text>
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
  infoBox: {
    backgroundColor: colors.successBackground,
    borderRadius: 16,
    padding: 14,
  },
  infoText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  errorBox: {
    borderColor: colors.error,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  apiBox: {
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  apiTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '800',
  },
  apiMessage: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  apiMessageSuccess: {
    color: colors.success,
    fontWeight: '700',
  },
  apiMessageError: {
    color: colors.error,
    fontWeight: '700',
  },
  apiActions: {
    gap: 10,
  },
  apiButton: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  apiButtonPressed: {
    opacity: 0.82,
  },
  apiButtonDisabled: {
    opacity: 0.56,
  },
  apiButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
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
  recordImage: {
    borderRadius: 16,
    height: 160,
    width: '100%',
  },
  recordMeta: {
    color: colors.muted,
    fontSize: 13,
  },
});
