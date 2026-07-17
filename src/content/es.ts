import type { LandingCopy } from "./types";

export const es = {
  meta: {
    title: "memo — Memoria local para agentes de IA",
    description:
      "Memoria semántica persistente para cada agente de programación. Local, privada, buscable y guardada como Markdown.",
  },
  nav: {
    how: "Cómo funciona",
    features: "Funciones",
    install: "Instalar",
    github: "GitHub",
  },
  hero: {
    eyebrow: "Memoria local para IA",
    title: "Tu IA debería recordar.",
    body: "Memoria semántica persistente para cada agente. Privada, local y tuya.",
    install: "Instalar memo",
    github: "Ver en GitHub",
  },
  problem: {
    eyebrow: "Las sesiones terminan. El conocimiento no debería.",
    title: "Dejá de empezar de cero.",
    body: "memo lleva decisiones, hechos y preferencias durables a la próxima sesión antes de que tu agente responda.",
    lost: "Un agente nuevo reconstruye desde cero lo de ayer.",
    kept: "Un agente con memo empieza por lo que ya importa.",
  },
  loop: {
    eyebrow: "Un ciclo completamente local",
    title: "Guardá una vez. Recordá en todas partes.",
    body: "El conocimiento durable se convierte en Markdown legible, un índice híbrido y contexto preciso para cualquier agente MCP.",
    steps: [
      "Capturá conocimiento durable",
      "Indexá Markdown localmente",
      "Recuperalo en la próxima sesión",
    ],
  },
  featuresHeading: {
    eyebrow: "Mucho más que una base vectorial",
    title: "Memoria con criterio.",
    body: "memo sabe cuándo cambió el conocimiento, de dónde vino y qué agente lo necesita.",
  },
  features: [
    {
      id: "time-machine",
      title: "Máquina del tiempo",
      body: "Rebobiná el corpus y preguntá qué se sabía en cualquier fecha.",
    },
    {
      id: "contradictions",
      title: "Radar de contradicciones",
      body: "Encontrá decisiones obsoletas y resolvé conflictos sin borrar la historia.",
    },
    {
      id: "capture",
      title: "Captura automática",
      body: "Extraé aprendizajes durables del trabajo real sin comandos constantes.",
    },
    {
      id: "cross-agent",
      title: "Continuidad entre agentes",
      body: "Claude Code, Codex, Cursor, Devin y otros clientes MCP comparten una memoria.",
    },
  ],
  evidence: {
    eyebrow: "Menos contexto. Más continuidad.",
    title: "Memoria útil, medible.",
    body: "Una superficie MCP compacta y un presupuesto de recall ajustado reducen trabajo repetido mientras la actividad pública sigue siendo verificable.",
    illustration: "Grafo conceptual de memoria",
    updated: "Datos públicos actualizados",
  },
  install: {
    eyebrow: "Corre en tu máquina",
    title: "Un comando. Sin cuenta cloud.",
    body: "Usá MLX en Apple Silicon o el backend CPU en Linux. Tus prompts y memorias permanecen locales.",
    macos: "macOS / Apple Silicon",
    linux: "Linux / CPU",
    copy: "Copiar comando",
    copied: "Copiado",
    copyFailed: "No se pudo copiar. Seleccioná el comando manualmente.",
    docs: "Leer guía completa de instalación",
  },
  comparison: {
    eyebrow: "Por qué memo",
    title: "Local no es una función. Es la base.",
    body: "Una comparación compacta; el repositorio contiene la matriz completa con fuentes.",
    headers: ["Capacidad", "memo", "Memoria cloud", "Base vectorial"],
    rows: [
      {
        capability: "Local por defecto",
        memo: "Sí",
        cloud: "No",
        vector: "A veces",
      },
      {
        capability: "Viaje en el tiempo",
        memo: "Sí",
        cloud: "Raro",
        vector: "No",
      },
      {
        capability: "Contradicciones",
        memo: "Sí",
        cloud: "Parcial",
        vector: "No",
      },
      {
        capability: "Recall entre agentes",
        memo: "Sí",
        cloud: "Parcial",
        vector: "A medida",
      },
    ],
    full: "Ver comparación completa con fuentes",
  },
  final: {
    eyebrow: "Tus agentes ya aprenden",
    title: "Dejalos recordar.",
    body: "Instalá memo una vez y dale a cada sesión un punto de partida durable.",
    install: "Instalar memo",
    github: "Dar una estrella en GitHub",
  },
  footer: {
    source: "Código",
    pypi: "PyPI",
    license: "Licencia MIT",
    by: "Creado por Fernando Ferrari",
  },
} satisfies LandingCopy;
