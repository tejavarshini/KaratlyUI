# Karatly — Mobile App Conversion Guide

## Project Architecture Overview

| Layer | Technology | Details |
|---|---|---|
| **Framework** | React 19 + TypeScript | Functional components, hooks |
| **Build** | Vite 8 | Fast dev + production builds |
| **Routing** | react-router-dom v7 | `BrowserRouter` with basename |
| **Styling** | Tailwind CSS 4 | Utility-first, dark theme |
| **Charts** | Recharts 3 | SVG-based |
| **Animation** | framer-motion | Layout groups, modal transitions |
| **State** | React Context | AuthContext, CartContext, GoldFlowContext |
| **API** | Native `fetch()` | No axios dependency |
| **Config** | `import.meta.env` | Backend URLs, merchant ID |
| **UI** | Mobile-first | 390px max-width frame, bottom nav, touch-friendly |

## Approach Comparison

| Approach | Code Rewrite | APK Support | Native Features | Effort |
|---|---|---|---|---|
| **Ionic + Capacitor** ✅ | **0%** | ✅ Native APK/AAB | ✅ Full plugin ecosystem | 1 day |
| React Native | ~80% | ✅ | ✅ | Weeks |
| PWA-only | 0% | ❌ Play Store restricted | ❌ Limited | Free |
| Raw Android WebView | 0% UI | ✅ | ❌ Manual bridge needed | Medium |

## Recommended: Ionic + Capacitor

Wraps the existing Vite + React build as-is into a native Android app. Zero code rewrite.

### Required Setup

```bash
# 1. Install Ionic CLI + Capacitor
npm install -g @ionic/cli
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Build Vite app
npm run build   # outputs to dist/public/

# 3. Init Capacitor
npx cap init Karatly com.karatly.app --webDir dist/public

# 4. Add Android platform
npx cap add android

# 5. Sync web build into native project
npx cap sync

# 6. Open Android Studio and build APK
npx cap open android
# In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK
```

### Required Code Changes

| File | Change | Reason |
|---|---|---|
| `src/main.tsx` | `BrowserRouter` → `HashRouter` | Capacitor serves from `file://`; pushState fails on reload |
| `vite.config.ts` | Add `base: './'` | Relative asset paths for `file://` protocol |
| `index.html` / `index.css` | Self-host Google Fonts or use system fallback | Offline availability |

No other code changes needed. Tailwind, Recharts, framer-motion, fetch APIs, Context state all work without modification.

## APK Build Process

```bash
# 1. Build web assets
npm run build

# 2. Sync to Android project
npx cap sync android

# 3. Generate debug APK
cd android
./gradlew assembleDebug
# APK at: android/app/build/outputs/apk/debug/app-debug.apk

# 4. Production / signed APK
# - Generate keystore:
#     keytool -genkey -v -keystore karatly.keystore -alias karatly -keyalg RSA -keysize 2044 -validity 10000
# - Place in android/app/
# - Configure signing in android/app/build.gradle
# - Run: ./gradlew assembleRelease
```

**First debug APK**: ~30 minutes.

## Mobile Optimization

| Requirement | Action | Priority |
|---|---|---|
| Status bar | `@capacitor/status-bar` plugin — match dark theme | Low |
| Splash screen | Config in `capacitor.config.ts` — brand colors + logo | Medium |
| Push notifications | `@capacitor/push-notifications` plugin | Later |
| Biometric auth | `@capacitor/biometric-auth` — OTP bypass | Optional |
| OTP auto-read | `@capacitor/sms` — read SMS for OTP | Nice-to-have |
| File size | Current build ~1.1MB JS — fine for mobile | OK |
| Safe areas | Capacitor handles notch via `viewport-fit=cover` | Low |
| Hardware back | Capacitor intercepts back button by default | Handled |

### Potential Blockers

| Blocker | Solution |
|---|---|
| `BrowserRouter` fails on `file://` | Switch to `HashRouter` (1-line change) |
| Absolute asset paths | `base: './'` in vite config |
| Google Fonts offline | Bundle fonts or use system fallback |
| `localhost` in dev | `npx cap run android` serves via live reload |
| CORS in dev | Already handled — API backends accept requests |
| `localStorage` | Works fine in Capacitor WebView |

## Performance: Capacitor vs Flutter

| Aspect | Capacitor (WebView) | Flutter (native paint) |
|---|---|---|
| Render engine | Chromium WebView | Skia custom 2D engine |
| JS execution | V8 engine | Dart VM |
| Startup time | ~1-2s | ~300-500ms |
| UI smoothness (60fps) | ✅ Excellent | ✅ Excellent |
| Complex animations | ✅ framer-motion | ✅ Native |
| Large lists (virtual scroll) | ⚠️ May need `react-window` for 10k+ items | ✅ Native scrolling |
| Memory | ~50-100MB | ~40-80MB |
| APK size | ~5-8MB | ~15-25MB |

### Verdict for Karatly

Capacitor wins because:
- Karatly is a financial dashboard (forms, charts, API calls, lists) — not a game
- The bottleneck is network requests (live gold rates, passbook, orders) — both approaches wait the same time
- UI is already built and mobile-optimized — no gain from redrawing in Dart
- Zero code rewrite = ship in days vs weeks

## Cost Analysis (Android + iOS)

| Item | Capacitor | Flutter |
|---|---|---|
| **IDE** | Android Studio (free) + VS Code (free) | Android Studio (free) + VS Code (free) |
| **Framework / SDK** | Capacitor + Ionic CLI (free, MIT) | Flutter SDK (free, BSD-3) |
| **Node.js / Dart** | Node.js (free) | Dart SDK (free, bundled) |
| **Development certs** | None | None |
| **Code signing** | Built into Android Studio (free) | Built into Android Studio (free) |
| **Android Play Store** | **$25 one-time** | **$25 one-time** |
| **Apple Developer Program** | **$99/year** | **$99/year** |
| **Push notifications** | Firebase Cloud Messaging (free) | Firebase Cloud Messaging (free) |
| **API backend hosting** | Already have your own ✅ | Already have your own ✅ |
| **Third-party packages** | All npm packages free | `fl_chart`, `riverpod`, `go_router` all free |
| **Build server / CI** | GitHub Actions (free tier) | Same |
| **App store assets** | Canva (free) | Same |
| **Privacy policy** | Free templates online | Same |

### Total Minimum Cost

| | **Year 1** | **Each subsequent year** |
|---|---|---|
| **Both approaches** | **$124** ($25 + $99) | **$99** (Apple renewal) |

### The Real Cost: Time vs Rewrite

| Cost Type | Capacitor | Flutter |
|---|---|---|
| **Upfront development** | 0 hours (reuse existing code) | 300–400 hours (full rewrite) |
| **Cost at $50/hr dev rate** | **$0** | **$15,000–$20,000** |
| **Bug parity** | Instant (no new bugs) | Weeks of QA |
| **Future features** | Add React code, same speed | Write in Dart, both codebases diverge |

Monetary cost is identical ($124 year one, $99/year after). The actual difference is **2 months of rewrite time vs shipping today**.
