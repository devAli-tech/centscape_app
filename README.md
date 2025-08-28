
# Centscape — Unified Wishlist (Expo + React Native + TypeScript)

## Quick start
```bash
npm i
npx expo start -c
```

Test deep link:
```bash
# iOS Simulator
xcrun simctl openurl booted "centscape://add?url=https%3A%2F%2Fwww.bhphotovideo.com%2Fc%2Fproduct%2F1617875-REG%2Fapple_airpods_max_sky_blue.html"

# Android emulator
adb shell am start -a android.intent.action.VIEW -d "centscape://add?url=https%3A%2F%2Fwww.bhphotovideo.com%2Fc%2Fproduct%2F1617875-REG%2Fapple_airpods_max_sky_blue.html"
```

Notes:
- Entry imports include `react-native-gesture-handler` and `react-native-get-random-values` (fixes Web Crypto UUID).
- Babel alias `@` is configured via `module-resolver` plugin.
- Dashboard wishlist is a **horizontal FlatList**; chevron navigates to full Wishlist screen.
- Cards have consistent dimensions; screens respect safe areas (top/bottom).
- AsyncStorage persistence with **v1→v2 migration** adding `normalizedUrl`.
- Dedup uses `normalizeUrl` (strip UTM, lowercase host, remove fragments).
