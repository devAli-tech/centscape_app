
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
export default function Skeleton({ style }: { style?: ViewStyle }) { return <View style={[styles.box, style]} />; }
const styles = StyleSheet.create({ box: { backgroundColor: "rgba(25,69,50,0.08)", borderRadius: 16, height: 120 } });
