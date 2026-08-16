import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import { LoginScreen } from './src/screens/LoginScreen';
import { ServiceFormScreen } from './src/screens/ServiceFormScreen';
import { ServiceListScreen } from './src/screens/ServiceListScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { importServiceRecordsFromApi, syncServiceRecordsWithApi } from './src/services/apiService';
import { loadServiceRecords, saveServiceRecords } from './src/services/storageService';
import type { ServiceRecord, ServiceRecordInput } from './src/types/serviceRecord';

type ScreenName = 'welcome' | 'login' | 'serviceList' | 'serviceForm';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('welcome');
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storageStatus, setStorageStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [storageError, setStorageError] = useState('');
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [apiMessage, setApiMessage] = useState('API externa lista para importar o sincronizar registros.');

  useEffect(() => {
    let isMounted = true;

    async function loadStoredRecords() {
      try {
        const storedRecords = await loadServiceRecords();

        if (!isMounted) {
          return;
        }

        setServiceRecords(storedRecords);
        setStorageStatus('ready');
        setStorageError('');
      } catch {
        if (!isMounted) {
          return;
        }

        setStorageStatus('error');
        setStorageError('No se pudieron cargar los registros guardados.');
      }
    }

    loadStoredRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistServiceRecords = async (recordsToSave: ServiceRecord[]) => {
    try {
      await saveServiceRecords(recordsToSave);
      setStorageStatus('ready');
      setStorageError('');
    } catch {
      setStorageStatus('error');
      setStorageError('No se pudo guardar el registro en el dispositivo.');
    }
  };

  const handleServiceSubmit = async (input: ServiceRecordInput) => {
    const nextRecord: ServiceRecord = {
      createdAt: new Date().toISOString(),
      description: input.description,
      id: `service-${Date.now()}-${serviceRecords.length + 1}`,
      ...(input.imageUri ? { imageUri: input.imageUri } : {}),
      ...(input.location ? { location: input.location } : {}),
      status: input.status,
      synced: false,
      title: input.title,
    };
    const nextRecords = [nextRecord, ...serviceRecords];

    setServiceRecords(nextRecords);
    setCurrentScreen('serviceList');

    await persistServiceRecords(nextRecords);
  };

  const handleImportFromApi = async () => {
    setApiStatus('loading');
    setApiMessage('Importando registros desde la API externa...');

    try {
      const result = await importServiceRecordsFromApi();
      const newRecords = result.records.filter(
        (record) => !serviceRecords.some((currentRecord) => currentRecord.id === record.id),
      );
      const nextRecords = [...newRecords, ...serviceRecords];

      if (newRecords.length > 0) {
        setServiceRecords(nextRecords);
        await persistServiceRecords(nextRecords);
      }

      setApiStatus('success');
      setApiMessage(
        `Importación finalizada: ${newRecords.length} registros nuevos. ${result.invalidCount} registros inválidos ignorados.`,
      );
    } catch (error) {
      setApiStatus('error');
      setApiMessage(error instanceof Error ? error.message : 'No se pudieron importar registros desde la API.');
    }
  };

  const handleSyncWithApi = async () => {
    if (serviceRecords.length === 0) {
      setApiStatus('error');
      setApiMessage('No hay registros locales para sincronizar.');
      return;
    }

    setApiStatus('loading');
    setApiMessage('Sincronizando registros locales con la API externa...');

    try {
      const result = await syncServiceRecordsWithApi(serviceRecords);
      const syncedRecords = serviceRecords.map((record) => ({ ...record, synced: true }));

      setServiceRecords(syncedRecords);
      await persistServiceRecords(syncedRecords);
      setApiStatus('success');
      setApiMessage(`Sincronización enviada correctamente. ID remoto de prueba: ${result.remoteId}.`);
    } catch (error) {
      setApiStatus('error');
      setApiMessage(error instanceof Error ? error.message : 'No se pudieron sincronizar los registros.');
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentScreen('serviceList');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    const needsAuthentication = currentScreen === 'serviceList' || currentScreen === 'serviceForm';

    if (needsAuthentication && !isAuthenticated) {
      return <LoginScreen onBack={() => setCurrentScreen('welcome')} onLoginSuccess={handleLoginSuccess} />;
    }

    if (currentScreen === 'welcome') {
      return <WelcomeScreen onStart={() => setCurrentScreen('login')} />;
    }

    if (currentScreen === 'login') {
      return <LoginScreen onBack={() => setCurrentScreen('welcome')} onLoginSuccess={handleLoginSuccess} />;
    }

    if (currentScreen === 'serviceForm') {
      return <ServiceFormScreen onCancel={() => setCurrentScreen('serviceList')} onSubmit={handleServiceSubmit} />;
    }

    return (
      <ServiceListScreen
        apiMessage={apiMessage}
        apiStatus={apiStatus}
        onImportFromApi={handleImportFromApi}
        onSyncWithApi={handleSyncWithApi}
        records={serviceRecords}
        onCreateNew={() => setCurrentScreen('serviceForm')}
        onLogout={handleLogout}
        storageError={storageError}
        storageStatus={storageStatus}
      />
    );
  };

  return (
    <>
      {renderScreen()}
      <StatusBar style="dark" />
    </>
  );
}
