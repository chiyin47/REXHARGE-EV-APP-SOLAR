import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Dashboard from './Dashboard';
import Settings from './Settings';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const THEME_KEY = 'rexharge_theme_mode';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ResultsScreen({ route, navigation }: any) {
  const imageUri = route.params?.imageUri;
  const panels = route.params?.estimatedPanels ?? 8;
  const rate = route.params?.rate ?? 0.28; // $/kWh
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // ROI calculations
  const systemCost = panels * 2500; // currency
  const annualGenerationKwh = (panels * 400 * 3.5 * 365) / 1000; // kWh/year
  const annualSavings = annualGenerationKwh * rate; // $/year
  const paybackYears = annualSavings > 0 ? systemCost / annualSavings : null;

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#021511' : '#fbfefb' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: isDark ? '#dff8ee' : '#064e3b', fontSize: 20, fontWeight: '700' }}>Estimate Results</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6 }}>
            <Text style={{ color: isDark ? '#a7f3d0' : '#065f46' }}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 16, borderRadius: 14, padding: 12, backgroundColor: isDark ? '#033532' : '#ffffff' }}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: '100%', height: 180, borderRadius: 10 }} />
          ) : (
            <View style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: isDark ? '#bdeed9' : '#065f46' }}>No image provided</Text>
            </View>
          )}
        </View>

        <View style={{ marginTop: 18, backgroundColor: isDark ? '#021f1b' : '#fff', borderRadius: 12, padding: 14 }}>
          <Text style={{ color: isDark ? '#dff8ee' : '#064e3b', fontWeight: '700' }}>Estimated Panels</Text>
          <Text style={{ fontSize: 36, fontWeight: '800', color: '#ffd166', marginTop: 6 }}>{panels}</Text>

          <Text style={{ color: isDark ? '#b7f0d9' : '#065f46', marginTop: 12 }}>Total System Cost</Text>
          <Text style={{ fontSize: 22, fontWeight: '700', color: isDark ? '#a7f3d0' : '#064e3b' }}>${systemCost.toLocaleString()}</Text>

          <Text style={{ color: isDark ? '#b7f0d9' : '#065f46', marginTop: 12 }}>Annual Generation</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: isDark ? '#9eead6' : '#065f46' }}>{Math.round(annualGenerationKwh).toLocaleString()} kWh / year</Text>

          <Text style={{ color: isDark ? '#b7f0d9' : '#065f46', marginTop: 12 }}>Estimated Annual Savings</Text>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#ffd166' }}>${annualSavings.toFixed(0)}</Text>

          <Text style={{ color: isDark ? '#b7f0d9' : '#065f46', marginTop: 12 }}>Payback Period</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: isDark ? '#a7f3d0' : '#064e3b' }}>{paybackYears ? paybackYears.toFixed(1) + ' years' : 'N/A'}</Text>
        </View>

      </ScrollView>
    </View>
  );
}

export default function App() {
  const systemScheme = useColorScheme();
  const [username, setUsername] = useState('Alex');
  const [rate, setRate] = useState(0.28);
  const [themeMode, setThemeMode] = useState<'system' | 'dark' | 'light'>('system');

  useEffect(() => {
    // load persisted theme
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (stored === 'dark' || stored === 'light' || stored === 'system') setThemeMode(stored as any);
      } catch (e) {
        console.warn('Failed to load theme', e);
      }
    })();
  }, []);

  const setTheme = useCallback(async (mode: 'system' | 'dark' | 'light') => {
    try {
      setThemeMode(mode);
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch (e) {
      console.warn('Failed to save theme', e);
    }
  }, []);

  const isDarkResolved = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  const Tabs = () => (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard">{(props) => <Dashboard {...props} username={username} rate={rate} isDark={isDarkResolved} />}</Tab.Screen>
      <Tab.Screen name="Settings">{(props) => <Settings {...props} username={username} setUsername={setUsername} rate={rate} setRate={setRate} themeMode={themeMode} setThemeMode={setTheme} isDark={isDarkResolved} />}</Tab.Screen>
    </Tab.Navigator>
  );

  return (
    <NavigationContainer theme={isDarkResolved ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTabs" component={Tabs} />
        <Stack.Screen name="Results" component={ResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
