import { DefaultAzureCredential } from "@azure/identity";
import { AIProjectClient } from "@azure/ai-projects";
type OpenAI = ReturnType<AIProjectClient["getOpenAIClient"]>;

// Talks to your Azure AI Foundry agent (e.g. "resume-assistant").
// Settings (in .env locally, App Service settings in Azure):
//   AZURE_AI_PROJECT_ENDPOINT  e.g. https://<resource>.services.ai.azure.com/api/projects/<project>
//   AZURE_AI_AGENT_NAME        e.g. resume-assistant
// Sign-in: DefaultAzureCredential uses "az login" on your computer, and the web app's
// managed identity on Azure App Service. Both need the "Azure AI User" role on the Foundry resource.

export function azureAgentConfigured() {
  return !!(process.env.AZURE_AI_PROJECT_ENDPOINT?.trim() && process.env.AZURE_AI_AGENT_NAME?.trim());
}

let client: OpenAI | undefined;
function getClient(): OpenAI {
  if (!client) {
    const project = new AIProjectClient(process.env.AZURE_AI_PROJECT_ENDPOINT!.trim(), new DefaultAzureCredential());
    client = project.getOpenAIClient({
      azureConfig: { allowPreview: true, agentName: process.env.AZURE_AI_AGENT_NAME!.trim() },
    });
  }
  return client;
}

/**
 * Sends one visitor message to the agent. Pass the conversationId from the previous reply
 * to continue the same conversation, so the agent remembers earlier questions.
 */
export async function askAzureAgent(message: string, conversationId?: string): Promise<{ reply: string; conversationId: string }> {
  const ai = getClient();
  let id = conversationId;

  if (id) {
    try {
      await ai.conversations.items.create(id, { items: [{ type: "message", role: "user", content: message }] });
    } catch {
      id = undefined; // conversation expired or unknown: start a fresh one below
    }
  }
  if (!id) {
    const conversation = await ai.conversations.create({ items: [{ type: "message", role: "user", content: message }] });
    id = conversation.id;
  }

  const response = await ai.responses.create({ conversation: id });
  return { reply: (response.output_text ?? "").trim(), conversationId: id };
}
