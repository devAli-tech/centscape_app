
import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useWishlist } from "@/hooks/useWishlist";
import WishlistItemCard from "@/components/WishlistItemCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WishlistScreen() {
  const { items, loading, remove, refresh } = useWishlist();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: insets.bottom, paddingTop: insets.top + 8 }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Wishlist</Text>
        <Pressable onPress={refresh} accessibilityRole="button" accessibilityLabel="Refresh wishlist"><Text style={styles.refresh}>Refresh</Text></Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <View style={{ flex: 1, gap: 8 }}>
            <WishlistItemCard item={item} height={220} />
            <Pressable onPress={() => remove(item.id)} accessibilityLabel={`Remove ${item.title}`} style={styles.removeBtn}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Remove</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={{ textAlign: "center", marginTop: 32 }}>No items yet</Text> : null}
        contentContainerStyle={{ paddingBottom: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "800", color: "#194532" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  refresh: { color: "#1E5A45", fontWeight: "700" },
  removeBtn: { backgroundColor: "#d9534f", borderRadius: 12, alignItems: "center", paddingVertical: 8 },
});
