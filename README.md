# Alerta Campus Colombia

Mapa nacional de alteraciones del orden en campus universitarios. PWA instalable, sin backend obligatorio, offline-first.

**Demo:** https://haroldco45.github.io/alerta-campus/

---

## Qué es

Herramienta ciudadana para que universidades, oficinas de seguridad, bienestar universitario y representantes estudiantiles **documenten hechos** que alteran el orden en los campus: bloqueos de acceso, artefactos incendiarios, vandalismo, quema de vehículos, interrupción forzada de clases, agresiones.

Cada reporte queda georreferenciado en un mapa nacional con capa de calor, permitiendo ver patrones por universidad, ciudad, tipo de hecho, fecha y hora.

## Qué NO es

**No es un registro de personas.** La app no permite ni permitirá:

- Nombres propios, apodos, cédulas, direcciones o redes sociales de personas
- Fotografías de rostros o de personas identificables
- Señalamientos, imputaciones o listas de individuos

Esto no es una limitación técnica, es una decisión de diseño con fundamento legal:

| Norma | Implicación |
|---|---|
| Constitución Política, Art. 37 | La protesta pacífica es un derecho fundamental. Lo reportable es el desmán, no la manifestación. |
| Ley 1581 de 2012, Art. 5 | La opinión política es **dato sensible**. Un registro de activistas es ilegal y sancionable por la SIC. |
| Ley 1581 de 2012, Art. 8 y 9 | Autorización previa, expresa e informada del titular. |
| Código Penal, Art. 220 y 221 | Injuria y calumnia por imputar conductas punibles a persona determinada. |
| Presunción de inocencia (Art. 29 CN) | Solo un juez determina responsabilidad penal. |
| Decreto 1377 de 2013, Art. 13 | Política de tratamiento publicada en `politica.html`. |

La app incluye un **validador automático** que detecta y bloquea cédulas, teléfonos, arrobas de redes sociales y patrones de señalamiento personal antes de guardar un reporte.

## Funcionalidades

- **Mapa nacional** con marcadores por gravedad y capa de calor conmutable
- **63 sedes universitarias** precargadas con coordenadas, o ubicación manual por GPS
- **Registro rápido** de incidentes: tipo, gravedad, afectación, fecha/hora real Colombia (UTC-5)
- **Filtros** por departamento, universidad, tipo de hecho, gravedad y rango de fechas
- **Panel de cifras**: totales, ranking de sedes, distribución por tipo, línea de tiempo mensual
- **Validador Habeas Data** que impide datos personales en las descripciones
- **Exportar / importar JSON** para consolidación entre sedes
- **Envío por WhatsApp** con formato estándar
- **Dataset nacional curado** en `datos/reportes.json` (solo lectura, se fusiona al abrir)
- **PWA instalable**, funciona sin conexión, datos locales en `localStorage`

## Estructura

```
alerta-campus/
├── index.html            # Aplicación completa (single-file)
├── politica.html         # Política de Tratamiento de Datos (Decreto 1377/2013)
├── manifest.json         # Manifiesto PWA
├── sw.js                 # Service worker (cache offline)
├── og-image.png          # Imagen Open Graph 1200x630
├── datos/
│   └── reportes.json     # Dataset nacional curado (opcional)
└── README.md
```

## Instalación

### GitHub Pages

1. Crear el repositorio `alerta-campus` en la cuenta `haroldco45`
2. Subir todos los archivos a la rama `main`
3. Settings → Pages → Source: `main` / `root`
4. Verificar que `og-image.png` y `politica.html` quedaron en la raíz

### Local

Abrir `index.html` en el navegador. Funciona sin servidor, aunque el service worker requiere `http://` o `https://`.

## Modelo de datos

Cada reporte se guarda con esta estructura:

```json
{
  "id": "AC-1757433600000-4821",
  "fecha": "2026-09-09T14:30:00-05:00",
  "universidad": "Universidad de Antioquia",
  "sede": "Ciudad Universitaria — Medellín",
  "ciudad": "Medellín",
  "departamento": "Antioquia",
  "lat": 6.2673,
  "lng": -75.5686,
  "tipo": "bloqueo",
  "gravedad": 2,
  "afectacion": ["clases", "movilidad"],
  "descripcion": "Bloqueo de la portería principal durante tres horas.",
  "fuente": "Testigo directo",
  "creado": "2026-09-09T14:45:12-05:00",
  "origen": "local"
}
```

## Consolidación nacional

GitHub Pages es estático, así que hay dos rutas para el mapa nacional:

**Ruta A — sin backend (recomendada para arrancar).** Cada sede exporta su JSON desde la app y lo envía. El coordinador fusiona los reportes en `datos/reportes.json` y hace commit. Todos los usuarios ven el consolidado al abrir la app.

**Ruta B — con backend.** En Ajustes se puede configurar una URL de API. Si está vacía, la app opera 100 % local. Si se define, hace `GET {API}/reportes` y `POST {API}/reportes`. Compatible con el patrón Node.js + PM2 ya usado en la infraestructura de Vibras Positivas HM.

## Uso responsable

Esta herramienta documenta hechos para gestión de riesgo, planeación de seguridad y transparencia institucional. No sustituye la denuncia formal ante la Fiscalía, la línea 123, ni los canales disciplinarios de cada universidad. Los reportes son percepciones ciudadanas, no pruebas judiciales.

## Licencia

Uso libre para instituciones educativas y organizaciones ciudadanas colombianas. Prohibida la reventa o el uso para fines de perfilamiento de personas.

---

Desarrollada por Vibras Positivas HM — Derechos de Autor Reservados
