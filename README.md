

## Quick start
```bash
npm i
npx expo start -c
```

Test deep link:
```bash
# iOS Simulator
xcrun simctl openurl booted "centscape://add?url=https%3A%2F%2Fnextjs.org%2F"
xcrun simctl openurl booted "centscape://add?url=https%3A%2F%2Fvimeo.com%2F76979871"
xcrun simctl openurl booted "centscape://add?url=https%3A%2F%2Fexample.com%2F"
xcrun simctl openurl booted "centscape://add?url=https%3A%2F%2Fwww.w3.org%2FStyle%2FExamples%2F011%2Ffirstcss.en.html"

# Android emulator
adb shell am start -a android.intent.action.VIEW -d "centscape://add?url=https%3A%2F%2Fwww.bhphotovideo.com%2Fc%2Fproduct%2F1617875-REG%2Fapple_airpods_max_sky_blue.html"
```
