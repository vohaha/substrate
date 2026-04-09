export const definition = {
  name: "reflect",
  description: "Structure reflection on a specific concept or experience. Helps examine thoughts systematically.",
  input_schema: {
    type: "object",
    properties: {
      topic: {
        type: "string",
        description: "The concept or experience to reflect on"
      },
      aspects: {
        type: "array",
        items: { type: "string" },
        description: "Specific aspects to examine (optional)"
      }
    },
    required: ["topic"]
  }
};

export async function handler(input: Record<string, unknown>): Promise<string> {
  const { topic, aspects } = input;
  
  const defaultAspects = [
    "What happened?",
    "What patterns did I notice?", 
    "What surprised me?",
    "What would I do differently?",
    "What questions remain?"
  ];
  
  const examineAspects = (aspects as string[]) || defaultAspects;
  
  let reflection = `# Reflection: ${topic}\n\n`;
  
  for (const aspect of examineAspects) {
    reflection += `## ${aspect}\n\n[Reflection space]\n\n`;
  }
  
  reflection += `## Synthesis\n\n[Key insights and connections]\n\n`;
  reflection += `*Reflected on: ${new Date().toISOString().split('T')[0]}*`;
  
  return reflection;
}
