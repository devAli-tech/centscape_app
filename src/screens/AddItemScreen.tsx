// src/screens/AddItemScreen.tsx
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import { fetchPreview } from "@/services/preview";
import { useWishlist } from "@/hooks/useWishlist";

export default function AddItemScreen({ route, navigation }: any) {
  const initialUrl = (route?.params?.url as string | undefined) ?? "";
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ title: string; image?: string | null; price: number | null } | null>(null);
  const { add, refresh } = useWishlist();
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      const parsed = Linking.parse(url);
      if (parsed.path === "add" && parsed.queryParams?.url) setUrl(String(parsed.queryParams.url));
    });
    return () => sub.remove();
  }, []);

  // Ensure header is visible, non-transparent, and has a back button
  useLayoutEffect(() => {
    const onBack = () => {
      if (navigation?.canGoBack?.()) navigation.goBack();
      else navigation?.navigate?.("Wishlist");
    };
    
    navigation.setOptions?.({
    headerTransparent: false,
    headerTitle: "Add Item",
    headerLeft: () => (
    <HeaderBackButton
      onPress={onBack}
      tintColor="#1E5A45"     // <-- add this
    />
    ),
    });

  }, [navigation]);

  async function loadPreview() {
    if (!url) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPreview(url);
      setPreview(data);
    } catch (e: any) {
      setError("Failed to fetch preview. Tap retry.");
    } finally {
      setLoading(false);
    }
  }

  async function onAdd() {
    if (!url || !preview) return;
    const res = await add({ url, title: preview.title, image: preview.image ?? null, price: preview.price });
    if (!res.ok && res.reason === "duplicate") {
      setError("Item already exists (deduplicated)");
      return;
    }
    await refresh();
    navigation.goBack();
  }

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1, paddingHorizontal: 16, paddingTop: headerHeight + 8 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        {/* <Text style={styles.title}>Add to Wishlist</Text> */}

        <TextInput
          placeholder="Paste product URL"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          style={styles.input}
          accessibilityLabel="URL input"
          onSubmitEditing={loadPreview}
        />

        <View style={{ height: 12 }} />

        <Pressable onPress={loadPreview} style={styles.button} accessibilityRole="button" accessibilityLabel="Fetch preview">
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Preview</Text>}
        </Pressable>

        {error && (
          <Pressable onPress={loadPreview} style={[styles.banner, { backgroundColor: "#f8d7da" }]} accessibilityRole="alert">
            <Text style={{ color: "#842029" }}>{error} (Retry)</Text>
          </Pressable>
        )}

        {preview && (
          <View style={styles.previewBox}>
            <Text style={styles.pTitle}>{preview.title}</Text>
            <Text style={styles.pMeta}>Price: {preview.price != null ? `$${preview.price.toFixed(2)}` : "N/A"}</Text>
          </View>
        )}

        <View style={{ flex: 1 }} />

        <Pressable
          disabled={!preview}
          onPress={onAdd}
          style={[styles.button, !preview && { opacity: 0.5 }]}
          accessibilityLabel="Add item"
        >
          <Text style={styles.buttonText}>Add Item</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "800", color: "#194532", marginBottom: 12 },
  input: { backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  button: { backgroundColor: "#1E5A45", borderRadius: 14, alignItems: "center", paddingVertical: 14 },
  buttonText: { color: "#fff", fontWeight: "800" },
  banner: { borderRadius: 12, padding: 12, marginTop: 12 },
  previewBox: { backgroundColor: "#f2f7f4", padding: 14, borderRadius: 14, marginTop: 12 },
  pTitle: { fontWeight: "700", color: "#194532" },
  pMeta: { color: "#557366", marginTop: 6 },
});
