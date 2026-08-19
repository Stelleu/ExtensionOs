import type { ConsultationFormSchema } from "@/types/database";

type ServiceKind = "extensions" | "wig" | "color" | "general";

function detectServiceKind(name: string, isExtension: boolean): ServiceKind {
  const n = name.toLowerCase();
  if (n.includes("wig") || n.includes("unit")) return "wig";
  if (n.includes("color") || n.includes("colour") || n.includes("balayage") || n.includes("bleach"))
    return "color";
  if (isExtension || n.includes("extension") || n.includes("tape") || n.includes("sew") || n.includes("microlink") || n.includes("weave"))
    return "extensions";
  return "general";
}

const baseFields = [
  {
    id: "previous_treatments",
    label: "Any previous chemical treatments in the last 6 months?",
    type: "textarea" as const,
    required: false,
  },
  {
    id: "scalp_sensitivity",
    label: "Any scalp sensitivity or allergies?",
    type: "textarea" as const,
    required: false,
  },
  {
    id: "consent",
    label: "I consent to this consultation information being stored for my appointment",
    type: "checkbox" as const,
    required: true,
  },
];

export function generateConsultationFormSchema(
  serviceName: string,
  isExtensionService: boolean
): ConsultationFormSchema {
  const serviceType = detectServiceKind(serviceName, isExtensionService);

  if (serviceType === "extensions") {
    return {
      title: "Hair Extension Consultation",
      serviceType,
      fields: [
        {
          id: "natural_hair_length",
          label: "Current natural hair length",
          type: "select",
          required: true,
          options: ['Above shoulders', 'Shoulder length', 'Mid-back', 'Waist+'],
        },
        {
          id: "desired_length",
          label: "Desired finished length",
          type: "select",
          required: true,
          options: ['14"', '16"', '18"', '20"', '22"', '24"', '26"'],
        },
        {
          id: "hair_texture",
          label: "Natural hair texture",
          type: "select",
          required: true,
          options: ["straight", "body-wavy", "kinky-curly", "yaki", "kinky"],
        },
        {
          id: "lifestyle",
          label: "Lifestyle / activity level (gym, swimming, etc.)",
          type: "textarea",
          required: false,
        },
        ...baseFields,
      ],
    };
  }

  if (serviceType === "wig") {
    return {
      title: "Wig Consultation",
      serviceType,
      fields: [
        {
          id: "head_circumference",
          label: "Approximate head circumference (cm)",
          type: "number",
          required: false,
        },
        {
          id: "preferred_style",
          label: "Preferred style / look",
          type: "textarea",
          required: true,
        },
        {
          id: "lace_type",
          label: "Preferred lace type",
          type: "select",
          required: false,
          options: ["HD lace", "Transparent lace", "Not sure"],
        },
        ...baseFields,
      ],
    };
  }

  if (serviceType === "color") {
    return {
      title: "Colour Consultation",
      serviceType,
      fields: [
        {
          id: "current_colour",
          label: "Current hair colour",
          type: "text",
          required: true,
        },
        {
          id: "desired_colour",
          label: "Desired colour / result",
          type: "textarea",
          required: true,
        },
        {
          id: "last_colour_date",
          label: "When was your last colour service?",
          type: "text",
          required: false,
        },
        ...baseFields,
      ],
    };
  }

  return {
    title: "Service Consultation",
    serviceType: "general",
    fields: [
      {
        id: "goals",
        label: "What would you like to achieve today?",
        type: "textarea",
        required: true,
      },
      ...baseFields,
    ],
  };
}
