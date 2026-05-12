import React, { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, useColorScheme } from 'react-native';

export default function Settings({ username, setUsername }: any) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [provider, setProvider] = useState('Default Energy Co.');
  const [rate, setRate] = useState('0.28');
  const [isDarkMode, setIsDarkMode] = useState(isDark);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: isDark ? '#061418' : '#fbfefb' }}>
      <Text style={{ color: isDark ? '#e6fffa' : '#064e3b', fontSize: 20, fontWeight: '800', marginBottom: 12 }}>Settings</Text>

      <View style={{ backgroundColor: isDark ? '#052e2a' : '#fff', padding: 14, borderRadius: 16, marginBottom: 12 }}>
        <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700' }}>User Profile</Text>
        <TextInput value={username} onChangeText={setUsername} placeholder="Name" placeholderTextColor={isDark ? '#8bd7bb' : '#94a3b8'} style={{ marginTop: 8, color: isDark ? '#e6fffa' : '#042a2b', padding: 8, borderRadius: 10, backgroundColor: isDark ? '#021f1b' : '#f3f8f3' }} />
      </View>

      <View style={{ backgroundColor: isDark ? '#052e2a' : '#fff', padding: 14, borderRadius: 16, marginBottom: 12 }}>
        <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700' }}>Energy Provider</Text>
        <Text style={{ color: isDark ? '#bdeed9' : '#6b7280', marginTop: 8 }}>{provider}</Text>
        <TouchableOpacity onPress={() => setProvider('GreenGrid Energy')} style={{ marginTop: 8 }}>
          <Text style={{ color: '#ffd166' }}>Switch to GreenGrid Energy (demo)</Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: isDark ? '#052e2a' : '#fff', padding: 14, borderRadius: 16, marginBottom: 12 }}>
        <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700' }}>Electricity Rate ($/kWh)</Text>
        <TextInput value={rate} onChangeText={setRate} keyboardType="numeric" placeholderTextColor={isDark ? '#8bd7bb' : '#94a3b8'} style={{ marginTop: 8, color: isDark ? '#e6fffa' : '#042a2b', padding: 8, borderRadius: 10, backgroundColor: isDark ? '#021f1b' : '#f3f8f3' }} />
      </View>

      <View style={{ padding: 14, borderRadius: 16, backgroundColor: isDark ? '#052e2a' : '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <View>
          <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700' }}>App Theme</Text>
          <Text style={{ color: isDark ? '#bdeed9' : '#6b7280', marginTop: 6 }}>{isDarkMode ? 'Dark' : 'Light'}</Text>
        </View>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      <View style={{ padding: 14, borderRadius: 16, backgroundColor: isDark ? '#052e2a' : '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700' }}>Notifications</Text>
          <Text style={{ color: isDark ? '#bdeed9' : '#6b7280', marginTop: 6 }}>Toggle push and in-app alerts</Text>
        </View>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>
    </View>
  );
}
