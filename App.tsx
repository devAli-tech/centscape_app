// App.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  NavigationContainer,
  DefaultTheme,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { Linking as RNLinking } from "react-native";
import * as ExpoLinking from "expo-linking";
import { RootNavigator } from "@/navigation";
import { WishlistProvider } from "@/hooks/useWishlist";

type RootStackParamList = {
  Root: undefined;
  AddItem?: { url?: string };
};

const prefix = ExpoLinking.createURL("/");

const linking = {
  prefixes: ["centscape://", prefix],
  config: {
    initialRouteName: "Root",
    screens: {
      // AddItem is a top-level stack screen
      AddItem: "add",
      // Your tab navigator under Root
      Root: {
        screens: {
          Dashboard: "dashboard",
          Wishlist: "wishlist",
          Wallet: "wallet",
          History: "history",
        },
      },
    },
  },
} as const;

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "transparent" },
};

export default function App() {
  const navRef = useNavigationContainerRef<RootStackParamList>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;

    const navigateFromUrl = (url: string | null) => {
      if (!url) return;
      const { path, queryParams } = ExpoLinking.parse(url);
      if (path === "add") {
        navRef.current?.navigate("AddItem", {
          url: (queryParams?.url as string) || "",
        });
      }
    };

    // Cold start (safety net)
    RNLinking.getInitialURL().then(navigateFromUrl).catch(() => {});

    // Runtime events
    const sub = RNLinking.addEventListener("url", ({ url }) =>
      navigateFromUrl(url)
    );
    return () => sub.remove();
  }, [ready, navRef]);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navRef}
        linking={linking}
        theme={navTheme}
        onReady={() => setReady(true)}
      >
        <WishlistProvider>
          <RootNavigator />
        </WishlistProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
