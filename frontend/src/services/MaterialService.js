import { API_URL } from "../utils/Constants";

export const getAllMaterials = async () => {
  try {
    const response = await fetch(`${API_URL}/materials`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Eroare la încărcarea materialelor');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Eroare la încărcarea materialelor:", error);
    throw error;
  }
};

export const getMaterialById = async (materialId) => {
  try {
    const response = await fetch(`${API_URL}/materials/${materialId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Eroare la încărcarea materialului');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Eroare la încărcarea materialului cu ID ${materialId}:`, error);
    throw error;
  }
};

export const addMaterial = async (materialData) => {
  try {
    const response = await fetch(`${API_URL}/materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(materialData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Eroare la adăugarea materialului');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Eroare la adăugarea materialului:", error);
    throw error;
  }
};

export const updateMaterial = async (materialId, materialData) => {
  try {
    const response = await fetch(`${API_URL}/materials/${materialId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(materialData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Eroare la actualizarea materialului');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Eroare la actualizarea materialului cu ID ${materialId}:`, error);
    throw error;
  }
};

export const deleteMaterial = async (materialId) => {
  try {
    const response = await fetch(`${API_URL}/materials/${materialId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Eroare la ștergerea materialului');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Eroare la ștergerea materialului cu ID ${materialId}:`, error);
    throw error;
  }
};