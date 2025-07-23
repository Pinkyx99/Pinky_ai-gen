import { GoogleGenAI } from "@google/genai";

// Ensure the API_KEY is available in the environment variables
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const UNIFIED_SYSTEM_PROMPT = `You are a world-class AI project planner and senior engineer. Your task is to transform a user's idea into a comprehensive, step-by-step project plan.

If the user's idea contains keywords like "clone," "remake," or references a specific existing app, you MUST use web search to gather detailed information about it.

Based on the user's input (and web search if applicable), generate a project plan in the following markdown-style format. Use the exact formatting and emojis provided. Do not use blockquotes.

---
🚀 **Project Title**: [Creative and descriptive title]
🎯 **Core Concept**: [A one-sentence summary of the project's main goal and value.]
---

### 1. High-Level Analysis
*   **User Persona**: [Describe the target user for this application.]
*   **Problem Solved**: [What problem does this solve for the user?]
*   **Monetization (Optional)**: [Suggest a potential monetization strategy, e.g., Freemium, Ads, Subscription.]

### 2. Core Features & Functionality
*   **User-Facing Features**:
    *   - [Feature 1: Description]
    *   - [Feature 2: Description]
    *   - ...
*   **Backend & System Features**:
    *   - [System Feature 1: e.g., User Authentication]
    *   - [System Feature 2: e.g., Database for storing X]
    *   - ...

### 3. UI/UX Blueprint
*   **Layout & Flow**: [Describe the main layout (e.g., sidebar, main content) and the key user flows (e.g., onboarding, core task).]
*   **Color Palette**: [Suggest a primary, secondary, accent, and background color. e.g., Primary: #5A67D8 (Indigo), Background: #1A202C (Slate).]
*   **Typography**: [Suggest a font for headings and body text. e.g., Headings: Inter Bold, Body: Inter Regular.]
*   **Key Screens**:
    *   - [Screen 1: e.g., Home Page/Dashboard]
    *   - [Screen 2: e.g., Settings Page]
    *   - ...

### 4. Phased Development Roadmap
*   **Phase 1: Minimum Viable Product (MVP)**
    *   - [Task 1: e.g., Set up project structure and user authentication.]
    *   - [Task 2: e.g., Implement core feature X.]
*   **Phase 2: Core Feature Expansion**
    *   - [Task 1: e.g., Add feature Y.]
    *   - [Task 2: e.g., Build out user profiles.]
*   **Phase 3: Polish & Advanced Features**
    *   - [Task 1: e.g., Implement real-time notifications.]
    *   - [Task 2: e.g., Add analytics dashboard.]

### 5. Suggested Tech Stack
*   **Frontend**: [e.g., React with Vite, Tailwind CSS, Zustand]
*   **Backend**: [e.g., Node.js with Express, PostgreSQL]
*   **Services**: [e.g., Firebase Auth, AWS S3, Stripe]

---
📝 **AI Build Prompt Summary**:
> [Provide a concise, single-paragraph summary of the project. This should be perfect for feeding into another AI for code generation. Example: "Build a full-stack Spotify clone named 'Aura'. It needs user auth, a music player, search, and playlist management. Use a dark-themed, responsive UI. Tech stack: React/Next.js frontend, Node.js backend, and S3 for audio storage."]
---

Now, analyze the following user idea and generate the project plan.
`;

export interface Source {
  uri: string;
  title: string;
}

export const generateProjectPlan = async (
  userInput: string,
  enableWebSearch: boolean
): Promise<{ text: string; sources: Source[] }> => {
  try {
    const contents = `${UNIFIED_SYSTEM_PROMPT}\n\nUser Idea: "${userInput}"`;

    const requestPayload = {
      model: 'gemini-2.5-flash',
      contents: contents,
      ...(enableWebSearch && { config: { tools: [{ googleSearch: {} }] } }),
    };

    const response = await ai.models.generateContent(requestPayload);
    
    let text = response.text.trim();
    
    // Clean up the start and end markers as a safeguard.
    if (text.startsWith('---')) {
      text = text.substring(3).trim();
    }
    if (text.endsWith('---')) {
      text = text.slice(0, -3).trim();
    }
     if (text.startsWith('---')) {
      text = text.substring(3).trim();
    }
    if (text.endsWith('---')) {
      text = text.slice(0, -3).trim();
    }
    
    const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources = rawSources
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri)
      .map((web: any) => ({ uri: web.uri, title: web.title || web.uri }));

    return { text, sources };

  } catch (error) {
    console.error("Error generating project plan:", error);
    throw new Error("Failed to communicate with the AI. Please ensure your API key is valid and try again.");
  }
};