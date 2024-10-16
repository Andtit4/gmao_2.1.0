/* // src/composables/useFetch.ts
import axios from 'axios';
import apiService from '@/services/apiService';

export const useFetch = async (endpoint: string) => {
  try {
    const response = await axios.get(apiService.getUrl() + endpoint);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error.message);
    throw error; // Relancer l'erreur pour la gestion ultérieure
  }
};

 */