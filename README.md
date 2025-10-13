# ⚽ Goleadores 2025

Sistema de gestión de goleadores para partidos semanales de fútbol entre amigos.

## 🚀 Características

- **Ranking en tiempo real** de goleadores ordenado por cantidad de goles
- **Gestión de partidos semanales** con registro de goles por partido
- **Interfaz responsive** optimizada para mobile-first
- **Panel de administración** para gestionar partidos y ajustes manuales
- **Búsqueda de jugadores** en el ranking
- **Estadísticas generales** del grupo
- **Confirmaciones de seguridad** para todas las acciones importantes

## 📱 Diseño Responsive

El diseño está optimizado siguiendo el principio **mobile-first**:
- **Mobile**: Diseño vertical, botones grandes, navegación táctil
- **Tablet**: Layout mejorado con más espacio
- **Desktop**: Grid de 2 columnas en admin, hover effects

## 🗂️ Estructura de Archivos

```
goleadores-2025/
├── index.html          # Estructura principal de la aplicación
├── styles.css          # Estilos CSS responsive (mobile-first)
├── script.js           # Lógica JavaScript de la aplicación
├── data.json           # Datos de jugadores y partidos
└── README.md           # Este archivo
```

## 🎯 Uso de la Aplicación

### Sección Ranking
- **Ver el ranking** completo de goleadores
- **Buscar jugadores** por nombre
- **Estadísticas** del grupo (total jugadores, goles, partidos)
- **Podium visual** para los 3 primeros lugares

### Sección Admin
**Registrar Partido Semanal:**
1. Seleccionar la fecha del partido (por defecto próximo domingo)
2. Agregar goles seleccionando jugadores
3. Revisar los goles del partido
4. Guardar el partido (actualiza automáticamente los totales)

**Gestión Manual:**
- Agregar o quitar goles individuales a cualquier jugador
- Útil para correcciones o ajustes

## 🔧 Funcionalidades Técnicas

### Almacenamiento de Datos
Los datos se almacenan en el **localStorage del navegador** para evitar problemas de CORS:
- **Datos iniciales**: Embebidos en el JavaScript
- **Cambios**: Guardados automáticamente en localStorage
- **Persistencia**: Los datos se mantienen entre sesiones del navegador

Estructura de datos:
```json
{
  "jugadores": [
    {"id": 1, "nombre": "Jugador", "goles": 10}
  ],
  "partidos": [
    {"id": 1, "fecha": "2025-10-13", "goleadores": [...]}
  ],
  "configuracion": {
    "ultimoPartido": 1,
    "proximoPartido": "2025-10-13"
  }
}
```

### Características JavaScript
- **Clase principal** `GoleadoresApp` que maneja toda la lógica
- **Carga asíncrona** de datos desde JSON
- **Gestión de estado** para partidos actuales
- **Sistema de notificaciones** para feedback al usuario
- **Modales de confirmación** para acciones importantes
- **Filtrado en tiempo real** del ranking

## 🚦 Cómo Empezar

1. **Clonar o descargar** los archivos
2. **Abrir `index.html`** en un navegador web
3. **¡Listo!** La aplicación carga automáticamente los datos

## 💡 Consejos de Uso

### Para el Administrador:
- Usar la sección **Admin** cada domingo después del partido
- **Verificar la fecha** antes de guardar el partido
- Usar **gestión manual** solo para correcciones
- Las **confirmaciones** previenen errores accidentales

### Funciones Especiales:
- **Ctrl + E**: Exportar datos de backup
- **Ctrl + R**: Resetear datos a valores iniciales (con confirmación)
- **Ctrl + L**: Limpiar datos del navegador
- **Búsqueda instantánea** en el ranking
- **Notificaciones visuales** para todas las acciones

## 🎨 Personalización

### Colores y Temas:
Los colores principales están definidos en CSS:
- Gradient principal: `#667eea` a `#764ba2`
- Podium: Oro (#ffd700), Plata (#c0c0c0), Bronce (#cd7f32)

### Agregar Jugadores:
Para agregar nuevos jugadores, editar `data.json`:
```json
{"id": 41, "nombre": "Nuevo Jugador", "goles": 0}
```

## 🔄 Flujo de Trabajo Semanal

1. **Domingo**: Jugar el partido
2. **Después del partido**: Abrir la app en la sección Admin
3. **Registrar goles**: Seleccionar jugadores que anotaron
4. **Guardar partido**: Confirmar y guardar
5. **Ver ranking actualizado**: Cambiar a sección Ranking

## 📊 Estadísticas

La app muestra automáticamente:
- **Total de jugadores** registrados
- **Total de goles** anotados por todos
- **Total de partidos** jugados

## 🛠️ Mantenimiento

### Backup de Datos:
- Usar **Ctrl + E** para exportar backup en formato JSON
- Los datos se guardan automáticamente en localStorage del navegador
- Revisar datos antes de partidos importantes

### Solución de Problemas:
- **Datos no se guardan**: Verificar que el navegador permita localStorage
- **Errores de goles**: Usar gestión manual para corregir
- **Reset completo**: Usar **Ctrl + R** para volver a datos iniciales
- **Limpiar cache**: Usar **Ctrl + L** para limpiar localStorage

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (móvil y desktop)
- ✅ Dispositivos iOS y Android
- ✅ Tablets y computadoras
- ✅ Funciona sin conexión a internet

---

**¡Disfruten los partidos y que gane el mejor! ⚽🏆**