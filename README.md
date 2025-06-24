# Church Admin Platform

Plataforma integral de administración para iglesias con contabilidad, presentaciones y meditación guiada por IA.

## 🚀 Características

- **Sistema Multi-tenant**: Cada iglesia tiene su propio espacio aislado
- **Contabilidad**: Sistema contable completo con integración bancaria chilena
- **Presentaciones**: Constructor de diapositivas para servicios
- **Meditación IA**: Generación de meditaciones personalizadas basadas en escrituras
- **Gestión de usuarios**: Sistema de roles y permisos

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Monorepo**: Turborepo con pnpm workspaces
- **UI Components**: Radix UI + Tailwind
- **Estado**: Zustand + TanStack Query
- **Validación**: Zod + React Hook Form

## 📦 Estructura del Proyecto

```
church-admin/
├── apps/
│   ├── web/              # Aplicación Next.js principal
│   └── mobile/           # App React Native (futuro)
├── packages/
│   ├── ui/              # Componentes compartidos
│   ├── database/        # Esquemas y migraciones
│   ├── api-client/      # Cliente API tipado
│   └── shared/          # Lógica de negocio y tipos
└── services/
    ├── auth/            # Servicio de autenticación
    ├── ai/              # Integración con IA
    └── banking/         # Integración bancaria
```

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 20+
- pnpm 8.15.1+
- Cuenta de Supabase

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/church-admin.git
cd church-admin
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Configura las variables de entorno:
```bash
cp apps/web/.env.example apps/web/.env.local
# Edita .env.local con tus credenciales
```

4. Ejecuta las migraciones:
```bash
# En Supabase Dashboard, ejecuta el contenido de:
# supabase/migrations/20240101000000_initial_schema.sql
```

5. Inicia el servidor de desarrollo:
```bash
pnpm dev
```

El aplicación estará disponible en http://localhost:3001

## 📝 Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm lint` - Ejecuta el linter
- `pnpm test` - Ejecuta las pruebas
- `pnpm format` - Formatea el código con Prettier

## 🔐 Configuración de Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Copia las credenciales del proyecto:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Ejecuta las migraciones SQL en el editor SQL de Supabase

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.# CI/CD Test
