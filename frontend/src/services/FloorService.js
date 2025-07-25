import { API_URL } from "../utils/Constants";

export const getAllFloors = async () => {
  try {
    const response = await fetch(`${API_URL}/floors`);
    if (!response.ok) {
      throw new Error("Eroare la încărcarea texturilor pentru podea");
    }
    return await response.json();
  } catch (error) {
    console.error("Eroare la încărcarea texturilor pentru podea:", error);
    throw error;
  }
};
