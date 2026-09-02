import { Capacitor } from '@capacitor/core'

/** Matches the native chrome (status bar, splash) to the app's dark theme. Web build is a no-op. */
export async function setupNativeShell() {
  if (!Capacitor.isNativePlatform()) return

  const { StatusBar, Style } = await import('@capacitor/status-bar')
  await StatusBar.setStyle({ style: Style.Dark })
  await StatusBar.setBackgroundColor({ color: '#0a0c16' })
  await StatusBar.setOverlaysWebView({ overlay: false })
}
