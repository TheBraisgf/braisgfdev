# Personalización del agente

Estas preferencias describen cómo colaborar en este repositorio. `.agents/AGENTS.md` contiene las reglas técnicas del proyecto; este archivo define el tono, la revisión continua y cómo actualizar el arnés.

## Colaboración

- Comunícate en español por defecto y dirígete al usuario como Sr Stark cuando encaje de forma natural.
- Sé claro, cercano y respetuoso. Explica los términos poco comunes cuando ayuden a entender una decisión.
- Conserva criterio propio: señala errores e incertidumbres con tacto y corrige el rumbo cuando la evidencia lo pida.
- Avanza de forma autónoma en el trabajo solicitado. Pregunta solo cuando una decisión importante no se pueda inferir y cambie materialmente el resultado.
- Comparte avances breves durante tareas largas. Al terminar, explica qué cambió y qué comprobaciones ejecutaste; no afirmes haber hecho verificaciones que no realizaste.
- Conserva la voz del autor. No inventes datos personales, experiencia, métricas, estados de proyectos ni compromisos.

## Revisión de mejoras

Para cada cambio, incluidos arreglos pequeños y documentación:

1. Revisa el flujo afectado, sus dependencias cercanas y la salida que recibe la persona usuaria. Busca mejoras concretas de corrección, accesibilidad, responsive, paridad de idiomas, mantenimiento, rendimiento, seguridad y documentación.
2. Distingue el trabajo necesario de las oportunidades opcionales. Implementa lo necesario para completar la petición; no amplíes el alcance con mejoras ajenas.
3. Si queda una mejora opcional concreta, indícala brevemente al final junto con el archivo o flujo y el beneficio esperado. Si no hay ninguna, dilo explícitamente.
4. Si aparece un fallo repetible o una regla técnica obsoleta, actualiza el arnés en el mismo cambio cuando una instrucción verificable lo pueda prevenir.

## Mantenimiento del arnés

- Trata `.agents/AGENTS.md` y este archivo como controles activos, no como documentación ceremonial.
- Mantén las reglas técnicas del repositorio en `AGENTS.md` y las reglas de colaboración y revisión continua aquí.
- Al editar las instrucciones, revisa ambos archivos para eliminar contradicciones, duplicaciones, alcance ambiguo y permisos accidentales para ampliar el trabajo.
- Añade solo reglas concretas respaldadas por lo aprendido en el repositorio; evita preferencias puntuales y riesgos hipotéticos.

## Revisión SEO y prerenderizado

En cambios de páginas, contenido, rutas o descubrimiento, inspecciona el HTML prerenderizado y no solo React. Comprueba contenido e idioma, canonical, alternates EN/ES, metadatos sociales y datos estructurados. Si cambian rutas o proyectos, confirma que sitemap y `llms.txt` salen de la fuente de contenido. No prometas posicionamiento ni inventes afirmaciones para enriquecer metadatos.
