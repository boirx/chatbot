const express = require('express');
const WhatsAppService = require('./services/whatsappService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Instanciar servicio de WhatsApp
const whatsappService = new WhatsAppService();

// Rutas HTTP
app.get('/', (req, res) => {
    res.json({ 
        status: 'online', 
        service: 'whatsapp-bot-railway',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/health',
            status: '/status'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        uptime: Math.floor(process.uptime()),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

app.get('/status', (req, res) => {
    res.json({ 
        connected: whatsappService.isReady(),
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor web activo en puerto ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    
    // Iniciar WhatsApp después de que el servidor esté listo
    console.log('📱 Iniciando WhatsApp...');
    whatsappService.init();
});

// Manejar cierre graceful
process.on('SIGTERM', async () => {
    console.log('SIGTERM recibido, cerrando...');
    await whatsappService.destroy();
    process.exit(0);
});
