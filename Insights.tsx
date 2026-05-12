import React from 'react';
import { View, Text, useColorScheme, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default function Insights() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const monthly = [60, 55, 70, 80, 90, 95, 100, 96, 88, 78, 65, 58];
  const quarterly = [Math.round(monthly.slice(0,3).reduce((a,b)=>a+b,0)/3), Math.round(monthly.slice(3,6).reduce((a,b)=>a+b,0)/3), Math.round(monthly.slice(6,9).reduce((a,b)=>a+b,0)/3), Math.round(monthly.slice(9,12).reduce((a,b)=>a+b,0)/3)];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? '#061418' : '#fbfefb' }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ color: isDark ? '#e6fffa' : '#064e3b', fontSize: 20, fontWeight: '800', marginBottom: 12 }}>Insights</Text>

      <View style={{ borderRadius: 16, padding: 12, backgroundColor: isDark ? '#052e2a' : '#fff', marginBottom: 12 }}>
        <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700' }}>Monthly Savings (est.)</Text>
        <BarChart data={{ labels: ['J','F','M','A','M','J','J','A','S','O','N','D'], datasets: [{ data: monthly }] }} width={width - 40} height={160} fromZero chartConfig={{ backgroundGradientFrom: isDark ? '#021511' : '#ffffff', backgroundGradientTo: isDark ? '#021511' : '#ffffff', decimalPlaces: 0, color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, labelColor: (opacity = 1) => (isDark ? `rgba(183, 249, 214, ${opacity})` : `rgba(6, 78, 59, ${opacity})`) }} style={{ borderRadius: 12, marginTop: 8 }} />
      </View>

      <View style={{ borderRadius: 16, padding: 12, backgroundColor: isDark ? '#052e2a' : '#fff' }}>
        <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700' }}>Quarterly Production (kWh)</Text>
        <LineChart data={{ labels: ['Q1','Q2','Q3','Q4'], datasets: [{ data: quarterly }] }} width={width - 40} height={140} chartConfig={{ backgroundGradientFrom: isDark ? '#021511' : '#ffffff', backgroundGradientTo: isDark ? '#021511' : '#ffffff', color: (opacity = 1) => `rgba(255, 209, 102, ${opacity})`, labelColor: (opacity = 1) => (isDark ? `rgba(183, 249, 214, ${opacity})` : `rgba(6,78,59,${opacity})`) }} bezier style={{ borderRadius: 12, marginTop: 8 }} />
      </View>

      <View style={{ height: 24 }} />

      <View style={{ borderRadius: 16, padding: 12, backgroundColor: isDark ? '#052e2a' : '#fff' }}>
        <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontWeight: '700' }}>Local Solar Rebates</Text>
        <Text style={{ color: isDark ? '#bdeed9' : '#065f46', marginTop: 8 }}>Find available rebates and incentives for your area. (Placeholder)</Text>
      </View>
    </ScrollView>
  );
}
