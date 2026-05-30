# Edge IoT Dashboard

Dashboard web desarrollado en React para la visualización y monitoreo en tiempo real de dispositivos IoT conectados mediante MQTT y Azure IoT Hub. La aplicación permite consultar telemetría, eventos, alertas y predicciones de anomalías almacenadas en Azure Cosmos DB.

---

## Descripción

Edge IoT Dashboard es una interfaz web que centraliza la información generada por dispositivos IoT basados en ESP32. El sistema permite visualizar variables ambientales, eventos detectados por sensores, alertas generadas por modelos de inteligencia artificial y el historial almacenado en la nube.

La solución está integrada con:

- Azure IoT Hub
- Azure Functions
- Azure Cosmos DB
- MQTT
- React
- Vite

---

## Características

### Monitoreo en tiempo real

Visualización de:

- Temperatura
- Humedad
- Estado térmico
- Estado de enfriamiento
- Estado de calefacción

### Gestión de eventos

Registro y consulta de:

- Intrusiones detectadas
- Caídas detectadas
- Impactos detectados
- Eventos normales

### Predicción de anomalías

Visualización de resultados obtenidos mediante modelos Edge AI:

- Probabilidad de anomalía futura
- Nivel de confianza
- Estado predictivo

### Historial de datos

Consulta de información almacenada en Azure Cosmos DB:

- Telemetría
- Eventos
- Alertas

### Diseño responsivo

- Compatible con escritorio
- Compatible con tablets
- Compatible con dispositivos móviles

---

## Arquitectura

```text
ESP32 + Sensores
        │
        ▼
     MQTT
        │
        ▼
 Azure IoT Hub
        │
        ▼
 Azure Functions
        │
        ▼
 Azure Cosmos DB
        │
        ▼
 React Dashboard
```

---

## Tecnologías utilizadas

### Frontend

- React
- Vite
- JavaScript
- CSS3

### Backend Cloud

- Azure Functions
- Azure IoT Hub
- Azure Cosmos DB

### Comunicación

- MQTT
- HTTPS REST API

### Inteligencia Artificial

- Edge Impulse
- Modelos TinyML

---

## Estructura del proyecto

```text
edge-iot-dashboard/
│
├── public/
│
├── src/
│   ├── components/
│   ├── services/
│   ├── pages/
│   ├── hooks/
│   ├── App.jsx
│   ├── main.jsx
│   └── App.css
│
├── package.json
├── vite.config.js
└── README.md
```

---

## Funcionalidades principales

### Dashboard principal

Presenta:

- Resumen del estado de los dispositivos
- Indicadores de sensores
- Estado operativo

### Tabla de telemetría

Muestra:

| Campo | Descripción |
|---------|-------------|
| Device ID | Identificador del dispositivo |
| Temperatura | Temperatura registrada |
| Humedad | Humedad registrada |
| Timestamp | Fecha y hora de captura |

### Tabla de eventos

Muestra:

| Campo | Descripción |
|---------|-------------|
| Device ID | Dispositivo origen |
| Evento | Tipo de evento |
| Confianza | Confianza del modelo |
| Timestamp | Fecha y hora |

### Tabla de alertas

Muestra:

| Campo | Descripción |
|---------|-------------|
| Device ID | Dispositivo origen |
| Tipo de alerta | Tipo generado |
| Mensaje | Descripción |
| Timestamp | Fecha y hora |

---

## Instalación

### Clonar repositorio

```bash
git clone https://github.com/mcastillo9391/edge-iot-dashboard.git
cd edge-iot-dashboard
```

### Instalar dependencias

```bash
npm install
```

### Ejecutar entorno de desarrollo

```bash
npm run dev
```

### Generar versión de producción

```bash
npm run build
```

### Vista previa de producción

```bash
npm run preview
```

---

## Variables de entorno

Crear un archivo `.env`:

```env
VITE_API_URL=https://<azure-function-app>.azurewebsites.net/api
```

---

## Flujo de datos

1. El ESP32 captura información de sensores.
2. Los datos son enviados mediante MQTT.
3. Azure IoT Hub recibe la información.
4. Azure Functions procesa los mensajes.
5. Los registros son almacenados en Cosmos DB.
6. El Dashboard consulta la API.
7. Los datos son visualizados en tiempo real.

---

## Casos de uso

### Monitoreo de cadena de frío

- Supervisión de temperatura
- Control de humedad
- Generación de alertas

### Detección de anomalías

- Predicción temprana de fallos
- Detección de comportamientos anormales

### Seguridad

- Detección de intrusión
- Detección de impactos
- Detección de caídas

---

## Autor

**Manuel Castillo**

Proyecto académico de Internet de las Cosas (IoT) e Inteligencia Artificial en el Borde (Edge AI).

---

## Licencia

Este proyecto se distribuye bajo licencia MIT.
