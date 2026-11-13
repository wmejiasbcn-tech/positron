# Positrón — Segundo Cerebro Positrónico WAIPL

**Nodo #33** | Círculo: Estructura | Verify: Ejecutar

> Es el segundo cerebro positrónico de todo el ecosistema y del propio Soberano,
> y es el centro de mando completamente interactivo.

## Identidad

| Campo | Valor |
|-------|-------|
| ID canónico | `positron` |
| Nodo | #33 de 47 |
| Círculo | Estructura |
| Jurisdicción | Cerebro operativo |
| Verify | Ejecutar (artefacto comprobable) |
| Creado por | Z.ai |
| Color | `#7B6CFF` (estructura) |

## Función

Es el segundo cerebro positrónico de todo el ecosistema y del propio soberano y es el centro de mando completamente interactivo.

## Importancia

Permite al Soberano no solo observar el estado del sistema, sino trabajar activamente dentro de él: crear capturas de conocimiento, enviar comandos a los NPCs del sistema, comunicarse por chat bidireccional con el cerebro, revisar archivos del vault, gestionar el compartimento personal de forma exclusiva, y recibir notificaciones en tiempo real.

## Arquitectura técnica

| Componente | Tecnología |
|------------|-----------|
| Framework | Next.js 16 + App Router + TypeScript 5 |
| Base de datos | PostgreSQL (Vercel Postgres / Neon) via Prisma ORM |
| LLM | z-ai-web-dev-sdk (backend) |
| Voz | Web Speech API (STT/TTS) + ElevenLabs |
| UI | Tailwind CSS 4 + shadcn/ui + Lucide |
| Diseño | Cyberpunk dark mode (#0a0a1a), glassmorphism |

### Migración SQLite a PostgreSQL

El sistema original usa SQLite (5-7 tablas). Para deploy en Vercel, migra a PostgreSQL.

Ver `MIGRATION_GUIDE.md` para pasos detallados.

## 7 NPCs (Normas y Procedimientos)

| NPC | Función | Estado |
|-----|---------|--------|
| CAP | Recibir/preservar info sin filtro | Operativo |
| CLA | Clasificar orientativamente | Operativo |
| ANA | Generar inteligencia accionable | Operativo |
| EJE | Ejecutar con planes B/C | DEUDA: simulado |
| AUD | Medir, detectar desviaciones | Operativo |
| CON | Prevenir/corregir incidentes | Operativo |
| MEJ | Evolucio
nar basado en datos | Operativo |

## 12 rutas API

| Ruta | Método | Descripción |
|------|--------|------------|
| `/api/chat` | POST | Enviar mensaje y recibir respuesta del LLM |
| `/api/chat` | GET | Historial de chat (ultimos 100) |
| `/api/captures` | POST | Crear captura con UUID/hash |
| `/api/captures` | GET | Listar capturas |
| `/api/commands` | POST | Enviar comando a NPC |
| `/api/commands` | GET | Historial de comandos |
| `/api/email` | POST | Enviar email |
| `/api/notifications` | GET | Obtener notificaciones |
| `/api/notifications/read` | POST | Marcar como leida |
| `/api/vault/files` | GET | Listar carpetas/archivos |
| `/api/vault/file` | GET | Leer archivo especifico |
| `/api/health` | GET | Datos del health-check |

## Compartimentación

- **PERSONAL**: Solo William. Protegido con PIN verificado en servidor (`/api/personal/unlock`, env `POSITRON_PERSONAL_PIN`, límite de intentos). Ecosistema no accede.
- **ECOSISTEMA**: Nodos autorizados + Carla. Briefings, coordinacion, estado del nucleo.

## ICP (Indice de Coherencia Positronica)

| Nivel | Umbral | Estado |
|-------|--------|--------|
| N1 Preventivo | >= 95% | Operacion normal |
| N2 Atencion | >= 85% y < 95% | Requiere atencion |
| N3 Critico | < 85% | Intervencion inmediata |

## Alineación ADN

### Alineado
- 3 capas (Nucleo/Vortice/Perifericos)
- 7 NPCs base
- Compartimentacion Personal/Ecosistema
- ICP + health-check
- UUID v4 + SHA-256 en capturas
- 12 compartimentos del vault
- Soberania del Soberano respetada

### Hallazgos del diagnóstico histórico (no revalidados en este cierre)
- Referencia Super Plantilla v2 (debe ser v3.0)
- Sin HACR-IA (Humildad/Atencion/Contexto/Revision)
- Sin Directiva Transversal v1.0 (5 estados, 3 autonomias)
- Sin Prompting 2026
- Sin CANON-CIERRE (7 casillas)
- PIN en texto plano en Informe (debe ser env var)
- NPC-EJE simulado (debe ser real o marcado como DEUDA)

## Estado verificado — 2026-11-13

- **Código fuente:** HECHO — versionado en `wmejiasbcn-tech/positron`, rama `main`.
- **Identidad:** HECHO — nodo **#33 de 47**, círculo Estructura.
- **GitHub:** HECHO — PR #25 fusionada; merge commit `45164dd2b8e799c1771babed189a1930b9cd94b2`.
- **CI:** HECHO — workflow `43450560669` completado con `success`; CodeQL completado con `success`.
- **Producción:** HECHO — Vercel deployment `dpl_4pG2K6FTMgJCRP84CzPpFz9wu8qV`, `READY`, destino `production`, alias `positron-gamma.vercel.app`.
- **SCI:** contrato `/api/sci/webhook` documentado; esta comprobación no acredita una prueba E2E del bus ni de todas las rutas.
- **Bus Hermes:** no se declara operativo con la evidencia de este cierre.

## CANON-CIERRE

| Casilla | Valor |
|----------|-------|
| Orquesta | Positrón WAIPL |
| Spec/N3 | N1 — ficha de nodo |
| Superficie | `wmejiasbcn-tech/positron`, rama `main` |
| Runtime | Despliegue Vercel de producción `READY` |
| Prueba | GitHub Actions y CodeQL `success`; despliegue Vercel `READY` |
| Alcance de la prueba | CI y estado de despliegue; no equivale a prueba funcional E2E de rutas, NPCs o bus SCI |
| Cierre | Identidad, documentación, CI y despliegue verificados para este corte |
| No es | No constituye acreditación funcional de integraciones no probadas |
