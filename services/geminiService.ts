export interface Source {
  uri: string;
  title: string;
}

export const generateProjectPlan = async (
  userInput: string,
  enableWebSearch: boolean
): Promise<{ text: string; sources: Source[] }> => {
  try {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput, enableWebSearch }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error generating project plan:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred while communicating with the server.";
    throw new Error(message);
  }
};
