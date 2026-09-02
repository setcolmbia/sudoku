# Sudoku Nova

Un sudoku casual con acabado profesional, construido con React + TypeScript + Vite. Pensado para funcionar en web hoy y ser exportable a iOS/Android más adelante sin rehacer nada.

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

## Preparado para exportar a móvil

El proyecto ya sigue las prácticas necesarias para empaquetarse como app nativa con [Capacitor](https://capacitorjs.com/):

- `vite.config.ts` usa `base: './'` (rutas relativas, imprescindible para `file://`/WebView).
- No depende de APIs exclusivas de navegador de escritorio; usa Pointer Events, `localStorage`, Web Audio y `navigator.vibrate` con *fallbacks* seguros.
- Incluye `manifest.webmanifest` e íconos para instalarse como PWA mientras tanto.

Cuando quieras generar los proyectos nativos:

```bash
npm run build
npm install -D @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init "Sudoku Nova" "com.tuempresa.sudokunova" --web-dir=dist
npx cap add ios
npx cap add android
npx cap sync
```

## Estructura

```
src/
  engine/     Generador y validador de sudoku (puro, sin dependencias de UI)
  store/      Estado global del juego (Zustand + persistencia)
  components/ UI: tablero, teclado numérico, HUD, modales
  hooks/      Temporizador y detección de pulsación sostenida
  utils/      Sonido (Web Audio) y vibración (Vibration API)
  types/      Tipos compartidos
```
