
import React, { memo, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type WishlistItem = {
  id: string;
  title: string;
  price: number | null;
  image?: string | null;
  source: string;
  normalizedUrl: string;
  createdAt: number;
};

type Props = { item: WishlistItem; onPress?: () => void; height?: number; };

export default memo(function WishlistItemCard({ item, onPress, height = 220 }: Props) {
  const [broken, setBroken] = useState(false);
  return (
    <Pressable style={[styles.card, { height }]} onPress={onPress} accessibilityRole="button" accessibilityLabel={`Open ${item.title}`}>
      <View style={styles.thumbWrap}>
        {broken || !item.image ? (
          <View style={styles.fallback}><Ionicons name="image" size={28} color="#6a7a72" /></View>
        ) : (
          <Image style={styles.thumb} source={{ uri: item.image }} resizeMode="contain" onError={() => setBroken(true)} />
        )}
      </View>
      <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.price != null ? `$${item.price.toFixed(2)}` : "N/A"}</Text>
      <Text numberOfLines={1} style={styles.meta}>{item.source} • {new Date(item.createdAt).toLocaleDateString()}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: { backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 20, padding: 12, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2, justifyContent: "space-between" },
  thumbWrap: { width: "100%", height: 120, alignItems: "center", justifyContent: "center" },
  thumb: { width: "100%", height: "100%" },
  fallback: { width: 64, height: 64, borderRadius: 12, backgroundColor: "#e6efe9", alignItems: "center", justifyContent: "center" },
  title: { fontWeight: "700", color: "#194532", textAlign: "center" },
  price: { fontWeight: "800", color: "#194532", marginTop: 6 },
  meta: { color: "#557366", marginTop: 4, fontSize: 12 },
});
