
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "@/screens/DashboardScreen";
import WishlistScreen from "@/screens/WishlistScreen";
import WalletScreen from "@/screens/WalletScreen";
import HistoryScreen from "@/screens/HistoryScreen";
import AddItemScreen from "@/screens/AddItemScreen";
import BottomTabs from "@/components/BottomTabs";

export type RootStackParamList = {
  Root: undefined;
  AddItem: { url?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const HEADER_BG = "#F2F7F4";   // matches your screen’s light green background accents
const TITLE_COLOR = "#194532"; // same as styles.title in AddItemScreen
const TINT = "#1E5A45";        // back arrow / interactive tint (your button color)

function Tabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabs {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
}


export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={Tabs} />
      <Stack.Screen
        name="AddItem"
        component={AddItemScreen}
        // RootNavigator (already set)
  options={{
    headerShown: true,
    headerTransparent: false,
    title: "Add to Wishlist",
    headerStyle: { backgroundColor: HEADER_BG },
    headerTitleStyle: { color: TITLE_COLOR, fontWeight: "800" },
    headerTintColor: TINT,   // the arrow will inherit this
  }}

      />
    </Stack.Navigator>
  );
}


