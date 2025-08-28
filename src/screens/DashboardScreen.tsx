
import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import WishlistItemCard from "@/components/WishlistItemCard";
import Skeleton from "@/components/Skeleton";
import { useWishlist } from "@/hooks/useWishlist";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const colors = {
  bgTop: "#D9F4D8",
  bgBottom: "#BEEBC2",
  card: "rgba(255,255,255,0.90)",
  text: "#194532",
  subText: "rgba(25,69,50,0.75)",
  progressTrack: "rgba(25,69,50,0.15)",
  progressFill: "#2F6D54",
};

const ITEM_WIDTH = 220;
const CARD_HEIGHT = 220;
const GAP = 12;

export default function DashboardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { items, loading } = useWishlist();
  const saved = 125;
  const goal = 499.99;
  const remaining = Math.max(0, goal - saved);
  const pct = Math.min(1, saved / goal);

  const Header = (
    <>
      <Text style={styles.header}>MY DASHBOARD</Text>
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>You have saved</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{`$${remaining.toFixed(2)} to go`}</Text></View>
        </View>
        <Text style={styles.savingBig}>${saved}</Text>
        <View style={styles.progressTrack}><View style={[styles.progressFill,{width:`${pct*100}%`}]} /></View>
      </View>

      <View style={[styles.card,{paddingBottom:16, marginBottom:14}]}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>WISHLIST</Text>
          <Pressable onPress={() => navigation.navigate("Wishlist")} hitSlop={10} accessibilityRole="button" accessibilityLabel="Go to full wishlist" style={{ padding: 4 }}>
            <Ionicons name="chevron-forward" size={22} color={colors.subText} />
          </Pressable>
        </View>

        {loading ? (
          <FlatList
            horizontal
            data={Array.from({ length: 6 }, (_, i) => `sk-${i}`)}
            keyExtractor={(k) => k}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 12, paddingRight: 60 }}
            ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
            renderItem={() => (<View style={{ width: ITEM_WIDTH }}><Skeleton style={{ height: CARD_HEIGHT }} /></View>)}
          />
        ) : items.length ? (
          <FlatList
            horizontal
            data={items}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 12, paddingRight: 60 }}
            ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
            renderItem={({ item }) => (<View style={{ width: ITEM_WIDTH }}><WishlistItemCard item={item} height={CARD_HEIGHT} /></View>)}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={ITEM_WIDTH + GAP}
            getItemLayout={(_, index) => ({
              length: ITEM_WIDTH + GAP,
              offset: (ITEM_WIDTH + GAP) * index,
              index
            })}
          />
        ) : (
          <View style={{ paddingTop: 12 }}>
            <Text style={{ color: colors.subText }}>No items yet</Text>
            <Pressable onPress={() => navigation.navigate("AddItem")} accessibilityRole="button" accessibilityLabel="Add your first wishlist item" style={{ marginTop: 10 }}>
              <Text style={{ color: "#1E5A45", fontWeight: "700" }}>Add your first item →</Text>
            </Pressable>
          </View>
        )}

        <Pressable onPress={() => navigation.navigate("AddItem")} accessibilityRole="button" accessibilityLabel="Add wishlist item" style={styles.addFab}>
          <Ionicons name="add" size={26} color={colors.text} />
        </Pressable>
      </View>

      <Text style={styles.motivation}>You will reach ${goal.toFixed(2)} goal{"\n"}in <Text style={styles.motivationStrong}>58 DAYS!</Text></Text>
    </>
  );

  return (
    <LinearGradient colors={[colors.bgTop, colors.bgBottom]} style={{flex:1}}>
      <FlatList
        data={[]}
        ListHeaderComponent={Header}
        renderItem={null as any}
        keyExtractor={(_,i)=>String(i)}
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 26, fontWeight: "800", color: colors.text, letterSpacing: 1, marginBottom: 14 },
  card: { backgroundColor: colors.card, borderRadius: 22, padding: 18, shadowColor: "#000", shadowOffset:{width:0,height:8}, shadowOpacity:0.08, shadowRadius:12, elevation:2, marginBottom:16 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { color: colors.subText, fontWeight: "600", fontSize: 16 },
  savingBig: { color: colors.text, fontSize: 40, fontWeight: "800", marginTop: 8, marginBottom: 8 },
  progressTrack: { height: 12, borderRadius: 999, backgroundColor: colors.progressTrack, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: colors.progressFill, borderRadius: 999 },
  sectionTitle: { color: colors.text, fontWeight: "800", fontSize: 18 },
  addFab: { position: "absolute", right: -6, bottom: -6, width: 44, height: 44, borderRadius: 999, backgroundColor: "#E3F0E7", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset:{width:0,height:6}, shadowOpacity:0.08, shadowRadius:8, elevation:3 },
  motivation: { textAlign: "center", color: colors.text, fontSize: 18, fontWeight: "600", marginTop: 6 },
  motivationStrong: { fontWeight: "900", fontSize: 24 },
  badge: { backgroundColor: "#2F6D54", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: "#EAF6F0", fontWeight: "700" },
});
