const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppService {
    constructor() {
        this.client = null;
        this.isClientReady = false;
        this.initClient();
    }

    initClient() {
        this.client = new Client({
            authStrategy: new LocalAuth({ 
                dataPath: './session'  // Persistente en Railway via Volume
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process'
                ]
            }
        });

        this.setupEvents();
    }

    setupEvents() {
        // QR Code
        this.client.on('qr', (qr) => {
            console.log('\n📱 ESCANEA ESTE QR CON TU WHATSAPP:\n');
            qrcode.generate(qr, { small: true });
            console.log('\n⏳ Esperando conexión...');
        });

        // Listo
        this.client.on('ready', () => {
            console.log('✅ BOT CONECTADO Y LISTO');
            this.isClientReady = true;
            
            // Notificar al admin
            const admin = process.env.ADMIN_NUMBER;
            if (admin) {
                const chatId = admin.includes('@c.us') ? admin : `${admin}@c.us`;
                this.client.sendMessage(chatId, '🤖 Bot iniciado en Railway y listo!');
            }
        });

        // Mensajes entrantes
        this.client.on('message_create', async (msg) => {
            if (msg.fromMe) return;
            
            console.log(`📩 ${msg.from}: ${msg.body}`);
            
            // Respuestas básicas
            const body = msg.body.toLowerCase();
            
            if (body === 'hola' || body === 'hi') {
                await msg.reply('👋 ¡Hola! Soy tu bot de WhatsApp.\nEscribe *!menu* para ver opciones.');
            }
            else if (body === '!menu') {
                await msg.reply(`📋 *MENÚ PRINCIPAL*

• !hola - Saludo
• !ping - Verificar estado
• !info - Información
• !hora - Fecha y hora

💡 Estoy funcionando en Railway 24/7`);
            }
            else if (body === '!ping') {
                await msg.reply('🏓 Pong! Online en Railway ✅');
            }
            else if (body === '!info') {
                await msg.reply('🤖 Bot creado con Node.js\n☁️ Alojado en Railway.app\n⚡ Siempre activo');
            }
            else if (body === '!hora') {
                await msg.reply(`🕐 ${new Date().toLocaleString('es-ES')}`);
            }
        });

        // Desconexión
        this.client.on('disconnected', (reason) => {
            console.log('⚠️ Desconectado:', reason);
            this.isClientReady = false;
            setTimeout(() => this.initClient(), 5000);
        });
    }

    init() {
        this.client.initialize().catch(err => {
            console.error('Error al iniciar:', err);
        });
    }

    isReady() {
        return this.isClientReady;
    }

    async destroy() {
        if (this.client) await this.client.destroy();
    }
}

module.exports = WhatsAppService;
