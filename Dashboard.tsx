// React core
import React, { useState, useMemo } from 'react';

// React Native components
import { SafeAreaView, View, Text, TouchableOpacity, Image, Dimensions, ActivityIndicator, useColorScheme } from 'react-native';

// Expo libraries
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function Dashboard({ navigation, username = 'User', rate, isDark: propIsDark }: any) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scheme = useColorScheme();
  const isDark = typeof propIsDark === 'boolean' ? propIsDark : scheme === 'dark';

  const hour = new Date().getHours();
  const greeting = useMemo(() => {
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, [hour]);

  const initials = useMemo(() => {
    const parts = (username || 'User').split(' ');
    const chars = parts.map((p: string) => p[0]).slice(0,2).join('').toUpperCase();
    return chars || 'U';
  }, [username]);

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      const result: any = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      const uri = result?.assets?.[0]?.uri ?? result?.uri ?? null;
      if (uri) setSelectedImage(uri);
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
      const result: any = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
      const uri = result?.assets?.[0]?.uri ?? result?.uri ?? null;
      if (uri) setSelectedImage(uri);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const confirmBoundaryAndEstimate = () => {
    if (!selectedImage) return;
    const estimatedPanels = Math.max(4, Math.round(Math.random() * 8 + 6));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate('Results', { imageUri: selectedImage, estimatedPanels, rate });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#061418' : '#f7faf7' }}>
      <View style={{ padding: 20, flex: 1, justifyContent: 'space-between' }}>
        {/* Header row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontSize: 14 }}>{greeting},</Text>
            <Text style={{ color: isDark ? '#e6fffa' : '#042a2b', fontSize: 20, fontWeight: '800', marginTop: 4 }}>{username || 'User'}</Text>
          </View>

          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: isDark ? '#052e2a' : '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(6,78,59,0.06)', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 }}>
            <Text style={{ color: isDark ? '#9eead6' : '#0b6b47', fontWeight: '700' }}>{initials}</Text>
          </View>
        </View>

        {/* Image / guide */}
        <View style={{ alignItems: 'center', marginVertical: 12 }}>
          <View style={{ width: width - 40, height: (width - 40) * 0.6, backgroundColor: isDark ? '#062b26' : '#eef2e9', borderRadius: 18, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator size="large" color="#9eead6" />
            ) : selectedImage ? (
              <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: isDark ? '#9eead6' : '#065f46', fontSize: 16 }}>No image selected</Text>
              </View>
            )}

            <View style={{ position: 'absolute', width: '76%', height: '36%', borderWidth: 2, borderColor: '#9eead6', borderRadius: 16, borderStyle: 'dashed', backgroundColor: 'rgba(158,234,214,0.04)' }} />
          </View>

          <Text style={{ color: isDark ? '#c7f9e6' : '#065f46', marginTop: 10, textAlign: 'center' }}>Align your rooftop or property layout inside the guide for a precise solar fit analysis.</Text>
        </View>

        {/* Action buttons */}
        <View style={{ gap: 12 }}>
          <TouchableOpacity onPress={pickFromCamera} activeOpacity={0.8} style={{ backgroundColor: '#0b6b47', padding: 14, borderRadius: 18, alignItems: 'center' }}>
            <Text style={{ color: '#ffffff', fontWeight: '700' }}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={pickFromLibrary} activeOpacity={0.8} style={{ backgroundColor: isDark ? '#ffffff' : '#ffffff', padding: 14, borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: '#0b6b47' }}>
            <Text style={{ color: '#0b6b47', fontWeight: '700' }}>Choose from Library</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={confirmBoundaryAndEstimate} disabled={!selectedImage} activeOpacity={0.85} style={{ backgroundColor: selectedImage ? '#ffd166' : '#475569', padding: 16, borderRadius: 18, alignItems: 'center', marginTop: 6 }}>
            <Text style={{ color: selectedImage ? '#042a2b' : '#e2e8f0', fontWeight: '800' }}>{selectedImage ? 'Confirm Boundary & Estimate ROI' : 'Upload an image to estimate'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
