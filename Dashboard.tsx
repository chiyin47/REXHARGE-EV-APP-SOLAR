import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator, useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function Dashboard({ navigation, username }: any) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      const result: any = await ImagePicker.launchCameraAsync({ quality: 0.8, base64: false });
      if (!result.cancelled) setImageUri(result.uri);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    try {
      const result: any = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, base64: false });
      if (!result.cancelled) setImageUri(result.uri);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const startScan = () => {
    if (!imageUri) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate('Results', { imageUri });
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#061418' : '#f7faf7', padding: 20, justifyContent: 'space-between' }}>
      <View>
        <Text style={{ color: isDark ? '#e6fffa' : '#064e3b', fontSize: 22, fontWeight: '800', marginTop: 6 }}>Hello, {username || 'Alex'}</Text>
        <View style={{ marginTop: 12, backgroundColor: isDark ? '#052e2a' : '#fff', borderRadius: 18, padding: 14 }}>
          <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontSize: 14, fontWeight: '600' }}>Projected Energy Offset</Text>
          <Text style={{ color: isDark ? '#c7f9e6' : '#064e3b', marginTop: 8, fontSize: 20, fontWeight: '800' }}>~ 4,200 kWh / year</Text>
          <Text style={{ color: isDark ? '#9eead6' : '#065f46', marginTop: 6, fontSize: 13 }}>Estimated savings: <Text style={{ fontWeight: '700', color: '#ffd166' }}>$1,200 / year</Text></Text>
        </View>
      </View>

      <View style={{ alignItems: 'center', marginVertical: 12 }}>
        <View style={{ width: width - 40, height: (width - 40) * 0.6, backgroundColor: isDark ? '#062b26' : '#eef2e9', borderRadius: 18, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
          {loading ? (
            <ActivityIndicator size="large" color="#9eead6" />
          ) : imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
          ) : (
            <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontSize: 16 }}>No image selected</Text>
            </View>
          )}

          <View style={{ position: 'absolute', width: '76%', height: '36%', borderWidth: 2, borderColor: '#9eead6', borderRadius: 16, borderStyle: 'dashed', backgroundColor: 'rgba(158,234,214,0.04)' }} />
        </View>

        <Text style={{ color: isDark ? '#c7f9e6' : '#065f46', marginTop: 10, textAlign: 'center' }}>Align your rooftop or property layout inside the guide for a precise solar fit analysis.</Text>
      </View>

      <View style={{ gap: 12 }}>
        <TouchableOpacity onPress={pickFromCamera} activeOpacity={0.8} style={{ backgroundColor: '#0b6b47', padding: 14, borderRadius: 18, alignItems: 'center' }}>
          <Text style={{ color: '#ffffff', fontWeight: '700' }}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={pickFromLibrary} activeOpacity={0.8} style={{ backgroundColor: isDark ? '#ffffff' : '#ffffff', padding: 14, borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: '#0b6b47' }}>
          <Text style={{ color: '#0b6b47', fontWeight: '700' }}>Choose from Library</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={startScan} disabled={!imageUri} activeOpacity={0.85} style={{ backgroundColor: imageUri ? '#ffd166' : '#475569', padding: 16, borderRadius: 18, alignItems: 'center', marginTop: 6 }}>
          <Text style={{ color: imageUri ? '#042a2b' : '#e2e8f0', fontWeight: '800' }}>{imageUri ? 'Start Solar Scan' : 'Upload an image to scan'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
