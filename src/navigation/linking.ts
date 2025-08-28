import * as Linking from "expo-linking";
import type { LinkingOptions } from "@react-navigation/native";
import type { RootStackParamList } from "@/navigation";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["centscape://", Linking.createURL("/")],
  config: {
    initialRouteName: "Root",
    screens: {
      Root: "",
      AddItem: "add"
    }
  }
};

export default linking;
