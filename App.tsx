import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import { LoginScreen } from './src/screens/LoginScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';

type ScreenName = 'welcome' | 'login';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('welcome');

  return (
    <>
      {currentScreen === 'welcome' ? (
        <WelcomeScreen onStart={() => setCurrentScreen('login')} />
      ) : (
        <LoginScreen onBack={() => setCurrentScreen('welcome')} />
      )}
      <StatusBar style="dark" />
    </>
  );
}
