import { API_URL } from "../utils/Constants";

export const getAllModels = async () => {
  try {
    const response = await fetch(`${API_URL}/models`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Eroare la încărcarea modelelor');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Eroare la încărcarea modelelor:", error);
    throw error;
  }
};

export const getModelById = async (modelId) => {
  try {
    const response = await fetch(`${API_URL}/models/${modelId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Eroare la încărcarea modelului');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Eroare la încărcarea modelului cu ID ${modelId}:`, error);
    throw error;
  }
};

export const addModel = async (modelData) => {
  try {
    const response = await fetch(`${API_URL}/models`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...modelData,
        category: modelData.category || 'uncategorized'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Eroare la adăugarea modelului');
    }

    return await response.json();
  } catch (error) {
    console.error("Eroare la adăugarea modelului:", error);
    throw error;
  }
};

export const deleteModel = async (modelId) => {
  try {
    const response = await fetch(`${API_URL}/models/${modelId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Eroare la ștergerea modelului');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Eroare la ștergerea modelului cu ID ${modelId}:`, error);
    throw error;
  }
};