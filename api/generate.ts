import { GoogleGenAI } from "@google/genai";

// This is a Vercel serverless function. We use `any` for request and response types for simplicity.
export default async function handler(req: any, res: any) {
  // Set cache-control headers to prevent Vercel's edge network from caching API responses.
  // This ensures every request hits the function in the specified region (lhr1).
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { userInput, enableWebSearch, apiKey } = req.body;

    if (!userInput) {
        return res.status(400).json({ error: 'User input is required.' });
    }
    
    if (!apiKey) {
      return res.status(400).json({ error: "API key is required." });
    }
    
    const ai = new GoogleGenAI({ apiKey });

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
    
    const contents = `${UNIFIED_SYSTEM_PROMPT}\n\nUser Idea: "${userInput}"`;

    const requestPayload = {
      model: 'gemini-2.5-flash',
      contents: contents,
      ...(enableWebSearch && { config: { tools: [{ googleSearch: {} }] } }),
    };

    const response = await ai.models.generateContent(requestPayload);
    
    let text = response.text.trim();
    
    if (text.startsWith('---')) text = text.substring(3).trim();
    if (text.endsWith('---')) text = text.slice(0, -3).trim();
    
    const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources = rawSources
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri)
      .map((web: any) => ({ uri: web.uri, title: web.title || web.uri }));

    return res.status(200).json({ text, sources });

  } catch (error: any) {
    console.error("Error in /api/generate:", error);
    // Specifically check for API key validation errors from the Google AI SDK
    if (error.message && error.message.includes('API key not valid')) {
      return res.status(401).json({ error: 'API key not valid. Please check your key.' });
    }
    const errorMessage = error.message || "An internal server error occurred.";
    return res.status(500).json({ error: errorMessage });
  }
}