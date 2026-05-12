import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

// Top-level simple input components to avoid re-creation per render
export function SimpleTextInput(props: any) {
  const { value, onChangeText, placeholder, placeholderTextColor, style, keyboardType, onBlur } = props;
  return (
    <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={placeholderTextColor} style={style} keyboardType={keyboardType} onBlur={onBlur} />
  );
}

export default function Settings({ username, setUsername, rate, setRate, themeMode, setThemeMode, isDark }: any) {
  const scheme = useColorScheme();
  const provider = 'Default Energy Co.';

  // Local state to avoid updating parent on every keystroke (prevents remounts / focus loss)
  const [localName, setLocalName] = useState(username ?? '');
  const [localRate, setLocalRate] = useState(rate ?? 0.28);

  useEffect(() => {
    setLocalName(username ?? '');
  }, [username]);

  useEffect(() => {
    setLocalRate(rate ?? 0.28);
  }, [rate]);

  const onNameBlur = useCallback(() => {
    // propagate to parent once editing finished
    if (setUsername) setUsername(localName);
  }, [localName, setUsername]);

  const onRateBlur = useCallback(() => {
    if (setRate) {
      // keep numeric, but allow decimal string entry
      const parsed = parseFloat(String(localRate));
      setRate(isNaN(parsed) ? 0 : parsed);
    }
  }, [localRate, setRate]);

  const changeTheme = useCallback((mode: 'system' | 'dark' | 'light') => {
    setThemeMode(mode);
  }, [setThemeMode]);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: isDark ? '#061418' : '#fbfefb' }}>
      <Text style={{ color: isDark ? '#e6fffa' : '#064e3b', fontSize: 20, fontWeight: '800', marginBottom: 12 }}>Settings</Text>

      <View style={{ backgroundColor: isDark ? '#052e2a' : '#fff', padding: 14, borderRadius: 16, marginBottom: 12 }}>
        <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700' }}>User Profile</Text>
        <SimpleTextInput
          value={localName}
          onChangeText={setLocalName}
          onBlur={onNameBlur}
          placeholder="Name"
          placeholderTextColor={isDark ? '#8bd7bb' : '#94a3b8'}
          style={{ marginTop: 8, color: isDark ? '#e6fffa' : '#042a2b', padding: 8, borderRadius: 10, backgroundColor: isDark ? '#021f1b' : '#f3f8f3' }}
        />
      </View>

      <View style={{ backgroundColor: isDark ? '#052e2a' : '#fff', padding: 14, borderRadius: 16, marginBottom: 12 }}>
        <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700' }}>Energy Provider</Text>
        <Text style={{ color: isDark ? '#bdeed9' : '#6b7280', marginTop: 8 }}>{provider}</Text>
        <TouchableOpacity onPress={() => {}} style={{ marginTop: 8 }}>
          <Text style={{ color: '#ffd166' }}>Switch to GreenGrid Energy (demo)</Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: isDark ? '#052e2a' : '#fff', padding: 14, borderRadius: 16, marginBottom: 12 }}>
        <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700' }}>Electricity Rate ($/kWh)</Text>
        <SimpleTextInput
          value={String(localRate)}
          onChangeText={(text: string) => {
            // keep local string-friendly value; allow decimal
            if (text === '' || text === '.' || text === '-'){
              setLocalRate(text as any);
              return;
            }
            // accept numeric-like strings
            const normalized = text.replace(/[^0-9.\-]/g, '');
            setLocalRate(normalized as any);
          }}
          onBlur={onRateBlur}
          keyboardType="numeric"
          placeholderTextColor={isDark ? '#8bd7bb' : '#94a3b8'}
          style={{ marginTop: 8, color: isDark ? '#e6fffa' : '#042a2b', padding: 8, borderRadius: 10, backgroundColor: isDark ? '#021f1b' : '#f3f8f3' }}
        />
      </View>

      <View style={{ padding: 14, borderRadius: 16, backgroundColor: isDark ? '#052e2a' : '#fff', marginBottom: 12 }}>
        <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700', marginBottom: 8 }}>App Theme</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {(['system','dark','light'] as const).map((m) => (
            <TouchableOpacity key={m} onPress={() => changeTheme(m)} style={{ flex: 1, padding: 10, marginHorizontal: 4, borderRadius: 10, alignItems: 'center', backgroundColor: themeMode === m ? (isDark ? '#0b6b47' : '#e6f4ea') : (isDark ? '#021f1b' : '#f3f8f3') }}>
              <Text style={{ color: themeMode === m ? (isDark ? '#e6fffa' : '#064e3b') : (isDark ? '#9eead6' : '#6b7280'), fontWeight: themeMode === m ? '800' : '600' }}>{m.charAt(0).toUpperCase() + m.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ padding: 14, borderRadius: 16, backgroundColor: isDark ? '#052e2a' : '#fff' }}>
        <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700' }}>Notifications</Text>
        <Text style={{ color: isDark ? '#bdeed9' : '#6b7280', marginTop: 8 }}>Toggle push and in-app alerts</Text>
      </View>
    </View>
  );
}
