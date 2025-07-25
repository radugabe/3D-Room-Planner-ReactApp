import { API_URL } from "../utils/Constants";

export const getAllWalls = async () => {
    try {
        const response = await fetch(`${API_URL}/walls`);
        if (!response.ok) {
            throw new Error("Eroare la încărcarea texturilor pentru pereți");
        }
        return await response.json();
    } catch (error) {
        console.error("Eroare la încărcarea texturilor pentru pereți:", error);
        throw error;
    }
};
