# 1. Entrar a la carpeta creada
cd bot-railway-[números]

# 2. Inicializar Git
git init

# 3. Preparar archivos
git add .

# 4. Commit inicial
git commit -m "Bot WhatsApp listo para Railway"

# 5. Renombrar rama a main
git branch -M main

# 6. Conectar con tu repo de GitHub
git remote add origin https://github.com/boirx/chatbot.git

# 7. Subir (con fuerza si hay conflictos previos)
git push -u origin main --force