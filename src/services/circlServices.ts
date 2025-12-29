import api from "./authService";

export interface Circl {
  circl_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const circlService = {
  getCircl: async (circlId: number): Promise<Circl> => {
    const response = await api.get(`/api/circls/${circlId}/`);
    return response.data;
  }
};
