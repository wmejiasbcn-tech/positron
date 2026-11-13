# Positrón — Segundo Cerebro Positrónico WAIPL

Repositorio de Positrón, segundo cerebro positrónico del WAIPL y para la transferencia de datos a Vercel.

Centro de mando interactivo del Soberano William L. Mejías Navarro.
**ADN** Super Plantilla Maestra Canónica v3.0 · HACR-IA · Directiva Transversal v1.0 · Prompting 2026

## Nodo canónico

- **ID** `positron`
- **Nodo** #33 de 47
- **Círculo** Estructura
- **Verify** Ejecutar (artefacto comprobable)
- **Creado por** Z.ai
- **Jurisdicción** Cerebro operativo

## Stack técnico

| Componente | Tecnología |
|------------|-----------|
| Framework | Next.js 16 + App Router + TypeScript 5 |
| Base de datos | PostgreSQL (Vercel Postgres / Neon) via Prisma ORM |
| LLM | z-ai-web-dev-sdk |
| Voz | Web Speech API + ElevenLabs |
| UI | Tailwind CSS 4 + shadcn/ui + Lucide |
| Diseño | Cyberpunk dark mode, glassmorphism |

## Migración SQLite a PostgreSQL

```bash
npm install
npx prisma generate
npx prisma migrate deploy
cp .env.example .env.local
npm run dev
```

## Documentación

- `FICHA.md` — Ficha canónica del nodo #33
- `MIGRATION_GUIDE.md` — Guía de migración SQLite a PostgreSQL
- `SCI_INTEGRATION.md` — Requisitos de integración SCI/n8n (48 secciones)

## Estado verificado — 2026-11-13

- **Código fuente:** HECHO — versionado en este repositorio. La alineación de Positrón con la Tabla 47 se integró mediante la PR #25.
- **Identidad canónica:** HECHO — nodo **#33 de 47**, círculo Estructura.
- **GitHub:** HECHO — PR #25 fusionada en `main`; merge commit `45164dd2b8e799c1771babed189a1930b9cd94b2`.
- **CI:** HECHO — workflow `43450560669` completado con resultado `success`; CodeQL también completado con `success`.
- **Producción:** HECHO — despliegue Vercel `dpl_4pG2K6FTMgJCRP84CzPpFz9wu8qV`, estado `READY`, destino `production`; alias `positron-gamma.vercel.app` asociado.
- **SCI:** el contrato `/api/sci/webhook` figura documentado. Este estado de despliegue no acredita por sí solo una prueba funcional de extremo a extremo del bus SCI ni de todas las rutas API.
