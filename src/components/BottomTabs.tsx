
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const colors = { tabBg: "#1E5A45", tabIcon: "#ECF7F1" };

export default function BottomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[styles.wrap, { paddingBottom: Math.max(10, 10 + insets.bottom) }]}
      accessibilityRole="tablist"
      accessibilityLabel="Bottom navigation"
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const options = descriptors[route.key].options;
        const label = options.tabBarLabel ?? options.title ?? route.name;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name as never);
        };

        const iconName =
          route.name === "Dashboard" ? "home" :
          route.name === "Wallet" ? "wallet" :
          route.name === "Wishlist" ? "cart" : "time";

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.item}
            accessibilityRole="tab"
            accessibilityLabel={String(label)}
            accessibilityState={{ selected: isFocused }}
          >
            <Ionicons name={iconName as any} size={22} color={colors.tabIcon} />
            <Text style={[styles.label, isFocused && styles.labelActive]}>{String(label)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.tabBg,
    borderRadius: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: { flex: 1, alignItems: "center", gap: 4 },
  label: { color: colors.tabIcon, fontSize: 12, opacity: 0.9 },
  labelActive: { fontWeight: "800", opacity: 1 },
});
