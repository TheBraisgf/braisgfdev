# Accesibilidad y experiencia

- Usa elementos semánticos, orden de encabezados, etiquetas asociadas, nombres accesibles, estados ARIA correctos y foco visible. No uses `div` clicables cuando sirve un botón o enlace.
- Cada acción debe funcionar con teclado y pantalla táctil. Para carruseles, tests, menús y galerías, proporciona estado visible y foco predecible; evita anunciar actualizaciones repetitivas.
- Respeta `prefers-reduced-motion` y el control de movimiento de la web. Las animaciones no deben esconder contenido antes de iniciar JavaScript ni dejarlo invisible sin observador.
- Revisa la cabecera sticky y los elementos flotantes en scroll, evitando que controles o paneles cubran navegación o foco.
- Comprueba 320–390 px, tablet y escritorio. Verifica que no aparezca scroll horizontal y que textos, controles, embeds y foco no se recorten.
- Si el cambio afecta layout o interacción, abre el sitio compilado en un navegador y mira una captura móvil y otra de escritorio. Inspecciona también estados abiertos, hover/foco, scroll y movimiento reducido cuando apliquen.
- Conserva el diseño editorial actual: movimiento reversible y discreto, composición original y controles claros. No añadas parallax solo por decoración.
