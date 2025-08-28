
import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "@/navigation";
import { WishlistProvider } from "@/hooks/useWishlist";

const prefix = Linking.createURL("/");

const linking = {
  prefixes: ["centscape://", prefix],
  config: {
    screens: {
      Root: {
        screens: {
          AddItem: "add",
          Dashboard: "dashboard",
          Wishlist: "wishlist",
          Wallet: "wallet",
          History: "history"
        },
      },
    },
  },
  getInitialURL: async () => {
    const url = await Linking.getInitialURL();
    return url ?? undefined;
  },
  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);
    const sub = Linking.addEventListener("url", onReceiveURL);
    return () => sub.remove();
  }
};

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "transparent" },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking} theme={navTheme}>
        <WishlistProvider>
          <RootNavigator />
        </WishlistProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
