import os
import sys

# Lista de archivos CRÍTICOS para que el piloto funcione
REQUIRED_FILES = [
    # Configuración del Proyecto
    "vercel.json",
    "package.json",
    "vite.config.ts",
    "index.html",

    # Backend
    "api/index.py",
    "api/requirements.txt",

    # Frontend y Estilos
    "src/main.tsx",
    "src/App.tsx",
    "src/pages/Landing.tsx",
    "src/index.css",
    "tailwind.config.js",
    "postcss.config.js",

    # Assets (Imágenes)
    "public/assets/logo_tryonyou.png",
    "public/assets/pau_blanco_chasquido.png",
    "public/assets/look1.png",
    "public/assets/look2.png",
    "public/assets/look3.png",
    "public/assets/montana_pantalones.png"
]

def check_system():
    print("🔍 INICIANDO DIAGNÓSTICO DEL PILOTO LAFAYETTE...\n")
    missing = []

    for file_path in REQUIRED_FILES:
        if os.path.exists(file_path):
            print(f"✅ OK: {file_path}")
        else:
            print(f"❌ FALTA: {file_path}")
            missing.append(file_path)

    print("\n" + "="*40)
    if missing:
        print("🚨 EL SISTEMA NO ESTÁ LISTO PARA VENTA.")
        print("⚠️  Faltan archivos de configuración o imágenes.")
        print("👉 Debes crear manualmente los archivos de configuración (vercel.json, index.html, etc.) que te compartí antes.")
        sys.exit(1)
    else:
        print("🚀 SISTEMA 'TRYONYOU' AL 100%.")
        print("✨ Todo listo para la demo. Ejecuta: vercel --prod")
        sys.exit(0)

if __name__ == "__main__":
    check_system()
