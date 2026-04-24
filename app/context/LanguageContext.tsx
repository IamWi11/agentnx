"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "es";

const translations = {
  en: {
    nav: {
      voiceAgents: "Voice Agents",
      tryDemo: "Try Demo",
      pricing: "Pricing",
      bookDemo: "Book a Demo",
    },
    hero: {
      badge: "AI Agents for Enterprise & Government Operations",
      h1a: "AI Agents That",
      h1b: "Automate Your Operations",
      p: "AgentNX deploys intelligent agents that handle documentation, approvals, routing, and compliance workflows — across government, pharma, cybersecurity, and healthcare.",
      cta1: "Book a Demo",
      cta2: "Try it Free →",
      voiceLabel: "Or talk to the AI right now",
      voiceBtn: "Talk to AgentNX AI",
    },
    industry: {
      heading: "Built for Your Industry",
      sub: "One platform. Multiple use cases. Pick your industry to see AgentNX in action.",
      items: [
        {
          icon: "🏛️",
          label: "Government",
          headline: "Automate Federal Compliance Workflows",
          desc: "AI agents that handle documentation, routing, approvals, and audit trails — built for SAM.gov registered contractors and federal agencies.",
          tags: ["DFARS Compliant", "Audit Trail", "Role-Based Approvals"],
        },
        {
          icon: "🔬",
          label: "Pharma & Biotech",
          headline: "Eliminate Manual Deviation Management",
          desc: "From incident submission to CAPA closure — AgentNX automates your entire GMP deviation workflow in minutes, not hours.",
          tags: ["21 CFR Part 11", "< 10 min Reports", "GMP Ready"],
        },
        {
          icon: "🔒",
          label: "Cybersecurity",
          headline: "Accelerate Security Incident Response",
          desc: "AI agents that triage alerts, generate incident reports, route to the right teams, and track remediation — end to end.",
          tags: ["Incident Triage", "Auto-Routing", "Remediation Tracking"],
        },
        {
          icon: "🏥",
          label: "Healthcare",
          headline: "Streamline Clinical Operations",
          desc: "Automate compliance documentation, staff notifications, and workflow approvals across your clinical and administrative teams.",
          tags: ["HIPAA Aware", "Workflow Automation", "Audit Ready"],
        },
      ],
    },
    howItWorks: {
      heading: "How AgentNX Works",
      sub: "One agent handles your entire workflow — from incident to resolution.",
      stepLabel: "Step",
      steps: [
        { step: "1", icon: "🚨", title: "Event Detected", desc: "Team member or system submits event via simple form" },
        { step: "2", icon: "📋", title: "Report Generated", desc: "AI drafts full documentation report instantly" },
        { step: "3", icon: "✉️", title: "Routed for Approval", desc: "Right person notified and reviews in one click" },
        { step: "4", icon: "✅", title: "Tasks Assigned", desc: "Agent creates tasks, assigns owners, sets deadlines" },
        { step: "5", icon: "🔒", title: "Workflow Closed", desc: "Agent tracks completion and closes the loop" },
      ],
    },
    valueProps: {
      heading: "Replace Manual Work With AI",
      items: [
        { before: "Hours writing compliance and incident reports", after: "AI drafts in minutes — you review and approve" },
        { before: "Chasing people for approvals via email", after: "Automatic routing with one-click approval" },
        { before: "Tasks tracked in spreadsheets and sticky notes", after: "Agent assigns, tracks, and reminds automatically" },
        { before: "Workflows left open for weeks with no visibility", after: "Automated closure with full audit trail" },
      ],
    },
    stats: {
      heading: "Why AgentNX",
      items: [
        { stat: "< 10 min", label: "Per Report Generated" },
        { stat: "100%", label: "Audit Trail Maintained" },
        { stat: "4+", label: "Industries Supported" },
        { stat: "SDVOSB", label: "Veteran-Owned Business" },
      ],
    },
    voiceCta: {
      badge: "Voice AI",
      heading: "Talk to an",
      headingBlue: "AI Agent Live",
      p: "AgentNX voice agents handle inbound calls, answer compliance questions, route requests, and guide users through workflows — all hands-free. Try our live demos now.",
      btn1: "Try Voice Agents →",
      btn2: "Call AgentNX Now",
    },
    bookDemo: {
      heading: "See AgentNX in Action",
      sub: "We'll walk you through a live demo tailored to your industry and use case.",
      placeholder: "your@company.com",
      btn: "Request a Demo",
      note: "No commitment. 30-minute call. We'll come prepared.",
      thanks: "Thanks! We'll reach out within 24 hours to schedule your demo.",
    },
    footer: "AI Agents for Enterprise & Government Operations",
    pricing: {
      badge: "Pricing",
      heading: "Start a pilot.",
      headingLine2: "Scale when it works.",
      sub: "One fixed-price pilot to prove ROI. Custom proposals for government, pharma, and enterprise contracts.",
      pilotLabel: "START YOUR PILOT",
      proposalLabel: "ENTERPRISE & GOV",
      faqHeading: "Common questions",
      back: "← Back to AgentNX.ai",
      pilot: {
        name: "Pilot",
        price: "$499",
        period: "/mo",
        description: "One voice agent, live in days. Month-to-month — no commitment.",
        features: [
          "1 voice agent (your choice of vertical)",
          "500 calls/month",
          "Standard onboarding — no custom integration",
          "Call logs + transcripts in VAPI dashboard",
          "Cancel anytime — no penalties",
        ],
        cta: "Start Pilot — $499/mo",
        note: "Credit card · Instant access · No contract",
      },
      proposal: {
        name: "Enterprise / Government",
        description: "Pricing is scoped per engagement. Government contracts, pharma GxP deployments, and multi-agent enterprise builds are quoted based on use case, scope, and integration requirements.",
        features: [
          "SDVOSB set-aside eligible — sole-source up to $5M (VA) / $4.5M (other agencies)",
          "Multi-agent deployments",
          "Custom integrations (ServiceNow, Splunk, Veeva, AD)",
          "NIST 800-53 · FedRAMP path · ATO support",
          "21 CFR Part 11 · GxP · HIPAA BAA",
          "Dedicated onboarding + SLA",
        ],
        cta: "Request a Proposal",
      },
      faq: [
        { q: "How fast can my pilot be live?", a: "Most pilots are configured and live within 5 business days of onboarding." },
        { q: "Is there per-minute or per-call billing?", a: "No. The pilot is a flat $499/month — no per-minute, per-call, or per-deviation charges." },
        { q: "Can I cancel anytime?", a: "Yes. Month-to-month. Cancel through your billing portal with no penalties." },
        { q: "Why no public pricing for enterprise?", a: "Government contracts, pharma deployments, and multi-agent builds vary significantly in scope. A proposal ensures you get the right configuration at the right price — not a generic tier." },
      ],
    },
  },

  es: {
    nav: {
      voiceAgents: "Agentes de Voz",
      tryDemo: "Probar Demo",
      pricing: "Precios",
      bookDemo: "Agendar Demo",
    },
    hero: {
      badge: "Agentes de IA para Operaciones Empresariales y Gubernamentales",
      h1a: "Agentes de IA que",
      h1b: "Automatizan tus Operaciones",
      p: "AgentNX implementa agentes inteligentes que gestionan documentación, aprobaciones, enrutamiento y flujos de cumplimiento — en gobierno, farmacéutica, ciberseguridad y salud.",
      cta1: "Agendar Demo",
      cta2: "Probar Gratis →",
      voiceLabel: "O habla con la IA ahora mismo",
      voiceBtn: "Hablar con AgentNX IA",
    },
    industry: {
      heading: "Hecho para tu Industria",
      sub: "Una plataforma. Múltiples casos de uso. Elige tu industria para ver AgentNX en acción.",
      items: [
        {
          icon: "🏛️",
          label: "Gobierno",
          headline: "Automatiza Flujos de Cumplimiento Federal",
          desc: "Agentes de IA que gestionan documentación, enrutamiento, aprobaciones y registros de auditoría — para contratistas de SAM.gov y agencias federales.",
          tags: ["Cumple DFARS", "Registro de Auditoría", "Aprobaciones por Rol"],
        },
        {
          icon: "🔬",
          label: "Farmacéutica",
          headline: "Elimina la Gestión Manual de Desviaciones",
          desc: "Desde el envío del incidente hasta el cierre de CAPA — AgentNX automatiza todo tu flujo GMP en minutos, no horas.",
          tags: ["21 CFR Parte 11", "< 10 min por Reporte", "Listo para GMP"],
        },
        {
          icon: "🔒",
          label: "Ciberseguridad",
          headline: "Acelera la Respuesta a Incidentes de Seguridad",
          desc: "Agentes de IA que clasifican alertas, generan informes, enrutan al equipo correcto y rastrean la remediación — de extremo a extremo.",
          tags: ["Clasificación de Alertas", "Enrutamiento Automático", "Seguimiento de Remediación"],
        },
        {
          icon: "🏥",
          label: "Salud",
          headline: "Optimiza las Operaciones Clínicas",
          desc: "Automatiza documentación de cumplimiento, notificaciones al personal y aprobaciones de flujo de trabajo en tus equipos clínicos y administrativos.",
          tags: ["Cumple HIPAA", "Automatización de Flujos", "Listo para Auditoría"],
        },
      ],
    },
    howItWorks: {
      heading: "Cómo Funciona AgentNX",
      sub: "Un agente maneja todo tu flujo de trabajo — desde el incidente hasta la resolución.",
      stepLabel: "Paso",
      steps: [
        { step: "1", icon: "🚨", title: "Evento Detectado", desc: "Un miembro del equipo envía el evento mediante un formulario simple" },
        { step: "2", icon: "📋", title: "Reporte Generado", desc: "La IA redacta el informe de documentación al instante" },
        { step: "3", icon: "✉️", title: "Enviado para Aprobación", desc: "La persona correcta es notificada y revisa con un clic" },
        { step: "4", icon: "✅", title: "Tareas Asignadas", desc: "El agente crea tareas, asigna responsables y establece plazos" },
        { step: "5", icon: "🔒", title: "Flujo Cerrado", desc: "El agente rastrea la finalización y cierra el proceso" },
      ],
    },
    valueProps: {
      heading: "Reemplaza el Trabajo Manual con IA",
      items: [
        { before: "Horas escribiendo informes de cumplimiento e incidentes", after: "La IA redacta en minutos — tú revisas y apruebas" },
        { before: "Persiguiendo aprobaciones por correo electrónico", after: "Enrutamiento automático con aprobación en un clic" },
        { before: "Tareas rastreadas en hojas de cálculo y notas adhesivas", after: "El agente asigna, rastrea y recuerda automáticamente" },
        { before: "Flujos de trabajo abiertos por semanas sin visibilidad", after: "Cierre automatizado con registro de auditoría completo" },
      ],
    },
    stats: {
      heading: "Por qué AgentNX",
      items: [
        { stat: "< 10 min", label: "Por Reporte Generado" },
        { stat: "100%", label: "Registro de Auditoría" },
        { stat: "4+", label: "Industrias Cubiertas" },
        { stat: "SDVOSB", label: "Empresa Veterano-Dueño" },
      ],
    },
    voiceCta: {
      badge: "Voz con IA",
      heading: "Habla con un",
      headingBlue: "Agente de IA en Vivo",
      p: "Los agentes de voz de AgentNX atienden llamadas, responden preguntas de cumplimiento, enrutan solicitudes y guían a los usuarios a través de flujos de trabajo — todo sin intervención humana.",
      btn1: "Probar Agentes de Voz →",
      btn2: "Llamar a AgentNX Ahora",
    },
    bookDemo: {
      heading: "Ve AgentNX en Acción",
      sub: "Te guiaremos a través de una demo en vivo adaptada a tu industria y caso de uso.",
      placeholder: "tu@empresa.com",
      btn: "Solicitar una Demo",
      note: "Sin compromiso. Llamada de 30 minutos. Vendremos preparados.",
      thanks: "¡Gracias! Te contactaremos en 24 horas para agendar tu demo.",
    },
    footer: "Agentes de IA para Operaciones Empresariales y Gubernamentales",
    pricing: {
      badge: "Precios",
      heading: "Inicia un piloto.",
      headingLine2: "Escala cuando funcione.",
      sub: "Un piloto a precio fijo para demostrar el ROI. Propuestas personalizadas para contratos de gobierno, farmacéutica y empresa.",
      pilotLabel: "INICIA TU PILOTO",
      proposalLabel: "EMPRESA Y GOBIERNO",
      faqHeading: "Preguntas frecuentes",
      back: "← Volver a AgentNX.ai",
      pilot: {
        name: "Piloto",
        price: "$499",
        period: "/mes",
        description: "Un agente de voz, activo en días. Mes a mes — sin compromiso.",
        features: [
          "1 agente de voz (vertical a tu elección)",
          "500 llamadas/mes",
          "Onboarding estándar — sin integración personalizada",
          "Registros de llamadas + transcripciones en VAPI",
          "Cancela cuando quieras — sin penalizaciones",
        ],
        cta: "Iniciar Piloto — $499/mes",
        note: "Tarjeta de crédito · Acceso inmediato · Sin contrato",
      },
      proposal: {
        name: "Empresa / Gobierno",
        description: "El precio se determina según el alcance del proyecto. Los contratos gubernamentales, despliegues GxP y builds empresariales multi-agente se cotizan según caso de uso, alcance y requisitos de integración.",
        features: [
          "Elegible para adjudicación directa SDVOSB hasta $5M (VA) / $4.5M (otras agencias)",
          "Despliegues multi-agente",
          "Integraciones personalizadas (ServiceNow, Splunk, Veeva, AD)",
          "NIST 800-53 · Ruta FedRAMP · Soporte ATO",
          "21 CFR Parte 11 · GxP · BAA HIPAA",
          "Onboarding dedicado + SLA",
        ],
        cta: "Solicitar Propuesta",
      },
      faq: [
        { q: "¿Qué tan rápido puede estar activo mi piloto?", a: "La mayoría de los pilotos se configuran y están activos en 5 días hábiles tras el onboarding." },
        { q: "¿Hay cobros por minuto o por llamada?", a: "No. El piloto es una tarifa fija de $499/mes — sin cobros por minuto, llamada ni desviación." },
        { q: "¿Puedo cancelar en cualquier momento?", a: "Sí. Mes a mes. Cancela desde tu portal de facturación sin penalizaciones." },
        { q: "¿Por qué no hay precios públicos para empresa?", a: "Los contratos gubernamentales, despliegues farmacéuticos y builds multi-agente varían significativamente en alcance. Una propuesta garantiza la configuración correcta al precio adecuado." },
      ],
    },
  },
};

export type Translations = typeof translations.en;

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("agentnx-lang") as Lang;
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("agentnx-lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
