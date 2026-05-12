import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Dashboard from './Dashboard';
import MyProjects from './MyProjects';
import Insights from './Insights';
import Settings from './Settings';
import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator, ScrollView, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ResultsScreen({ route, navigation }: any) {
  const imageUri = route.params?.imageUri;
  const [processing, setProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<null | {
    panels: number;
    annualSavings: number;
    breakEvenYears: number;
    energyPerYearKwh: number;
    monthlySavings: number[];
  }>(null);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [anim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 12 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(t);
        setTimeout(() => {
          const mock = {
            panels: Math.max(4, Math.round(Math.random() * 8 + 6)),
            annualSavings: parseFloat((Math.random() * 600 + 400).toFixed(0)),
            breakEvenYears: parseFloat((Math.random() * 5 + 3).toFixed(1)),
            energyPerYearKwh: parseFloat((Math.random() * 2000 + 1500).toFixed(0)),
            monthlySavings: Array.from({ length: 12 }, () => Math.round(Math.random() * 80 + 40)),
          };
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setResults(mock);
          setProcessing(false);
        }, 700);
      }
      setProgress(p);
      Animated.timing(anim, { toValue: p, duration: 300, useNativeDriver: false }).start();
    }, 450);

    return () => clearInterval(t);
  }, []);

  const progressWidth = anim.interpolate({ inputRange: [0, 100], outputRange: [0, width - 40], extrapolate: 'clamp' });

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#021511' : '#fbfefb' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: isDark ? '#dff8ee' : '#064e3b', fontSize: 20, fontWeight: '700' }}>Scan Results</Text>
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

        {processing ? (
          <View style={{ marginTop: 18 }}>
            <Text style={{ color: isDark ? '#b9f0d5' : '#0b5f48', fontSize: 16, fontWeight: '600' }}>Processing image</Text>
            <Text style={{ color: isDark ? '#9eead6' : '#065f46', marginTop: 6 }}>Analyzing roof area and estimating installable capacity...</Text>

            <View style={{ marginTop: 12, height: 14, backgroundColor: isDark ? '#042a24' : '#e6f4ea', borderRadius: 10, overflow: 'hidden' }}>
              <Animated.View style={{ height: 14, backgroundColor: '#ffd166', width: progressWidth, borderRadius: 10 }} />
            </View>

            <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: isDark ? '#b9f0d5' : '#065f46' }}>{Math.round(progress)}%</Text>
              <ActivityIndicator size="small" color="#ffd166" />
            </View>
          </View>
        ) : results ? (
          <>
            <View style={{ marginTop: 18, backgroundColor: isDark ? '#021f1b' : '#fff', borderRadius: 12, padding: 14 }}>
              <Text style={{ color: isDark ? '#dff8ee' : '#064e3b', fontWeight: '700' }}>Estimated Panels</Text>
              <Text style={{ fontSize: 36, fontWeight: '800', color: '#ffd166', marginTop: 6 }}>{results.panels}</Text>
              <Text style={{ color: isDark ? '#b7f0d9' : '#065f46', marginTop: 6 }}>Projected Annual Savings</Text>
              <Text style={{ fontSize: 26, fontWeight: '700', color: isDark ? '#a7f3d0' : '#064e3b', marginTop: 6 }}>${results.annualSavings.toLocaleString()}</Text>
              <Text style={{ color: isDark ? '#9eead6' : '#065f46', marginTop: 8 }}>Break-even: <Text style={{ fontWeight: '700', color: '#ffd166' }}>{results.breakEvenYears} years</Text></Text>
            </View>

            <View style={{ marginTop: 18 }}>
              <Text style={{ color: isDark ? '#dff8ee' : '#064e3b', fontSize: 16, fontWeight: '700', marginBottom: 8 }}>Monthly Savings (estimated)</Text>
              <BarChart 
                data={{ labels: ['J','F','M','A','M','J','J','A','S','O','N','D'], datasets: [{ data: results.monthlySavings }] }} 
                width={width - 40} 
                height={180} 
                fromZero 
                yAxisLabel="$"
                yAxisSuffix=""
                chartConfig={{ backgroundGradientFrom: isDark ? '#021511' : '#fff', backgroundGradientTo: isDark ? '#021511' : '#fff', decimalPlaces: 0, color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, fillShadowGradient: '#ffd166', fillShadowGradientOpacity: 1, barPercentage: 0.6, useShadowColorFromDataset: false, }} style={{ borderRadius: 12 }} />
            </View>

            <View style={{ marginTop: 18 }}>
              <Text style={{ color: isDark ? '#dff8ee' : '#064e3b', fontSize: 16, fontWeight: '700', marginBottom: 10 }}>Projected Annual Energy (kWh)</Text>
              <LineChart data={{ labels: ['Q1','Q2','Q3','Q4'], datasets: [{ data: [ Math.round(results.energyPerYearKwh * 0.22), Math.round(results.energyPerYearKwh * 0.28), Math.round(results.energyPerYearKwh * 0.26), Math.round(results.energyPerYearKwh * 0.24) ] } ] }} width={width - 40} height={160} bezier yAxisSuffix="kWh" chartConfig={{ backgroundGradientFrom: isDark ? '#021511' : '#ffffff', backgroundGradientTo: isDark ? '#021511' : '#ffffff', color: (opacity = 1) => `rgba(255, 209, 102, ${opacity})`, labelColor: (opacity = 1) => (isDark ? `rgba(183, 249, 214, ${opacity})` : `rgba(6, 78, 59, ${opacity})`), }} style={{ borderRadius: 12 }} />
            </View>

            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); navigation.goBack(); }} style={{ backgroundColor: isDark ? '#063a35' : '#e6f4ea', padding: 12, borderRadius: 10, flex: 1, marginRight: 8, alignItems: 'center' }}>
                <Text style={{ color: isDark ? '#bdeed9' : '#065f46', fontWeight: '700' }}>Scan Again</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { Haptics.selectionAsync(); }} style={{ backgroundColor: '#ffd166', padding: 12, borderRadius: 10, flex: 1, marginLeft: 8, alignItems: 'center' }}>
                <Text style={{ color: '#042a2b', fontWeight: '700' }}>Request Proposal</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={{ marginTop: 18 }}>
            <Text style={{ color: isDark ? '#bdeed9' : '#065f46' }}>No results available</Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

export default function App() {
  const scheme = useColorScheme();
  const [username, setUsername] = useState('Alex');

  const Tabs = () => (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard">{(props) => <Dashboard {...props} username={username} />}</Tab.Screen>
      <Tab.Screen name="My Projects" component={MyProjects} />
      <Tab.Screen name="Insights" component={Insights} />
      <Tab.Screen name="Settings">{(props) => <Settings {...props} username={username} setUsername={setUsername} />}</Tab.Screen>
    </Tab.Navigator>
  );

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTabs" component={Tabs} />
        <Stack.Screen name="Results" component={ResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
