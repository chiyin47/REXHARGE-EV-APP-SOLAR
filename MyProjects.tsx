import React from 'react';
import { View, Text, FlatList, TouchableOpacity, useColorScheme } from 'react-native';

const dummy = [
  { id: '1', name: 'Maple Residence', date: '2026-04-10', savings: '$1,150' },
  { id: '2', name: 'Oak Villa', date: '2026-03-02', savings: '$980' },
  { id: '3', name: 'Cedar Cottage', date: '2026-01-22', savings: '$1,360' },
];

export default function MyProjects() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: isDark ? '#061418' : '#f7faf7' }}>
      <Text style={{ color: isDark ? '#e6fffa' : '#064e3b', fontSize: 20, fontWeight: '800', marginBottom: 12 }}>My Projects</Text>
      <FlatList data={dummy} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <TouchableOpacity style={{ marginBottom: 12, padding: 14, borderRadius: 16, backgroundColor: isDark ? '#052e2a' : '#fff' }}>
          <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700', fontSize: 16 }}>{item.name}</Text>
          <Text style={{ color: isDark ? '#bdeed9' : '#6b7280', marginTop: 6 }}>{item.date} • Estimated savings: <Text style={{ fontWeight: '700', color: '#ffd166' }}>{item.savings}</Text></Text>
        </TouchableOpacity>
      )} />
    </View>
  );
}
