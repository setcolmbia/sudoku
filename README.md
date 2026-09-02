# Numi

Un sudoku casual con acabado profesional, construido con React + TypeScript + Vite. Publicado en web y empaquetado como app nativa de Android con Capacitor.

## Características

- **Generador propio de tableros** con backtracking aleatorizado y verificación de solución única (`src/engine/sudoku.ts`).
- **Tres dificultades** (Fácil / Medio / Difícil) que ajustan el número de pistas iniciales y de ayudas disponibles.
- **Notas / candidatos**: modo lápiz para anotar hasta 9 números posibles en una mini-cuadrícula dentro de cada casilla.
- **Marcar / desmarcar números**: mantén presionado un número del teclado para resaltar todas sus apariciones en el tablero; vuelve a presionar para quitarlo.
- **Resaltado por mantener presionada una casilla**: pulsación sostenida resalta toda la fila y columna para facilitar el escaneo visual.
- **Detección de errores en tiempo real**: si un número entra en conflicto con la fila, columna o caja según lo ya ingresado, la casilla se marca en rojo con animación y vibración/sonido.
- **Sistema de pistas (hints)** limitado por dificultad, que revela el valor correcto de una casilla.
- **Deshacer, borrar, pausa y continuar partida** (autoguardado en `localStorage`).
- **Estadísticas** de mejor tiempo por dificultad.
- **Sonido y vibración** sintetizados por código (sin assets externos), y ajustes para desactivarlos.
- **Diseño responsive "mobile-first"** con animaciones (Framer Motion), confeti en la victoria y tema oscuro cuidado.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción a dist/
npm run preview  # sirve el build de producción
```

## Despliegue web

Cada push a `main` compila el proyecto y lo publica automáticamente en GitHub Pages vía `.github/workflows/deploy.yml`:

**https://setcolmbia.github.io/sudoku/**

## App de Android

El proyecto está empaquetado como app nativa con [Capacitor](https://capacitorjs.com/) (carpeta `android/`, configuración en `capacitor.config.ts`).

### Descargar el APK ya compilado (sin instalar nada)

Cada push a `main` compila un APK de depuración automáticamente vía `.github/workflows/android-build.yml`:

1. Ve a la pestaña **Actions** del repo → workflow **"Build Android APK"**.
2. Entra al run más reciente (ícono ✅ verde).
3. En la sección **Artifacts**, descarga `numi-debug-apk` (es un .zip que contiene `app-debug.apk`).
4. Copia el `.apk` a tu teléfono e instálalo (Android te pedirá habilitar "instalar apps de fuentes desconocidas" la primera vez, solo para ese archivo).

Es un build de *depuración* (sin firmar para Play Store), pensado para instalar y probar directamente. Para publicar en Play Store hace falta generar un build de release firmado con tu propio keystore — no cubierto aquí.

### Compilar localmente (con Android Studio)

```bash
npm install
npm run build
npx cap sync android
npx cap open android    # abre el proyecto en Android Studio
```

Desde Android Studio: Run ▶ para probar en un emulador/dispositivo, o Build → Generate Signed Bundle/APK para un release firmado.

### Regenerar tras cambios en el código web

`android/app/src/main/assets/public` (el contenido web empaquetado) se regenera automáticamente en cada build de CI y con `npx cap sync`. Nunca se edita a mano ni se versiona.

### Ícono de la app

Las fuentes del ícono viven en `assets/` (`icon-only.png`, `icon-foreground.png`, `icon-background.png`), calcadas del mismo diseño que `public/favicon.svg`. Si cambia el logo, regenera todos los tamaños de Android con:

```bash
npx @capacitor/assets generate --android --iconBackgroundColor '#0f1220' --iconBackgroundColorDark '#0f1220'
```

### iOS

Compilar y probar una app iOS requiere una Mac con Xcode (restricción de Apple, no de este proyecto). Cuando tengas acceso a una:

```bash
npm install @capacitor/ios
npx cap add ios
npx cap sync ios
npx cap open ios
```

## Estructura

```
src/
  engine/     Generador y validador de sudoku (puro, sin dependencias de UI)
  store/      Estado global del juego (Zustand + persistencia)
  components/ UI: tablero, teclado numérico, HUD, modales
  hooks/      Temporizador y detección de pulsación sostenida
  utils/      Sonido (Web Audio), vibración y el bootstrap nativo (status bar)
  types/      Tipos compartidos
android/          Proyecto nativo generado por Capacitor
capacitor.config.ts  Configuración de la app nativa (appId, tema, splash)
```
