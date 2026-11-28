# Lista de control de DIGI INVITACIONES

Antes de publicar, recorrer esta lista **en todos los eventos, diseños y formatos**: tarjeta del catálogo, JPG, PDF, video, web y panel. Cuando Sandra marca un error en un diseño, la corrección se aplica en todos, no solo en el que nombró.

## Cómo revisar

```
python3 -m http.server 8811 &                                  # desde la carpeta del repo
node control/generar.js http://localhost:8811/panel/ . [ids]   # rehace las muestras (sin ids: todas)
node control/revisar.js                                        # revisión automática
```

Se publica recién cuando `revisar.js` muestra **"✓ Todo cumple la lista de control."**

## Reglas

**Coherencia**
- La tarjeta del catálogo, el JPG, el PDF, el video y la web de un mismo diseño muestran la misma invitación.
- Las webs del catálogo toman su JPG, PDF y video de una plantilla del panel (`DEMO_PAIR`), nunca de capturas de la página.
- El PDF lleva botones: Maps, Waze, confirmar por WhatsApp y agendar.
- El video es el animado: el texto aparece de a poco, con brillos.

**Contenido de muestra**
- Sin fotos de personas, ni de IA ni reales. Los dibujos de la temática sí van.
- Galerías con fotos o recuadros de "Tu foto": ocultas por ahora.
- Sin nombres de padres ni de padrinos.
- Los diseños neutros dicen "Nombre", sin nombre de nena ni de varón.
- El JPG lleva solo lo esencial.
- No se nombran marcas (Toy Story, Minecraft, Cars, etc.).

**Estilo**
- Dorado oficial (el del catálogo): #b8913f, #f6dc94, #d6ae5a, #f3d58c y #b38a3a. Nunca el cobrizo (#c98f48, #e2b676, #f7dcae).
- Sin recuadros de vidrio esmerilado sobre los diseños: el texto va directo sobre el fondo.
- Texto nunca encimado ni cortado. Los nombres de portada entran completos.
- Sello de muestra suave: una firma chica.
- Nunca usar el efecto de rayos de sol que giran en las portadas, ni en ningún lado. Usar otros efectos: luces que flotan, brillo que pasa, destellos.

**Webs**
- Todas las pestañas y acordeones arrancan **cerrados**, por ejemplo el paso 1 de confirmar asistencia. Esto vale también para el catálogo y el panel.
- Todas tienen cierre o despedida y efectos de aparición al deslizar.
- "Agendar en mi calendario" va debajo del calendario, no junto a los botones de ubicación.
- Pie "Creada con DIGI INVITACIONES" con link a digiinvitaciones.github.io, nunca a Floot.
- En las muestras, los botones (Waze, Maps, WhatsApp, enviar) no funcionan y muestran "es una muestra". En las invitaciones reales del panel, sí funcionan.

**Catálogo**
- No cambiar su estilo general sin que Sandra lo pida.
- No tocar `precios.js`.

**Protección de muestras**
- Ninguna muestra del catálogo se puede guardar tocándola ni arrastrándola: tarjetas, JPG, PDF, video y webs.
- Todas las muestras llevan el sello "DIGI INVITACIONES · MUESTRA" encima, elegante y suave. Así una captura de pantalla también sale sellada.
- No se baja la calidad de las muestras.
- Lo que se entrega al cliente desde el panel va sin sello: el bloque `<!--WM-->` se quita al entregar.
