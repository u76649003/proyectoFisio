import axios from 'axios';
import { API_URL } from '../../config';
import { authHeaders } from './authService';

// Obtener todos los programas personalizados
const getProgramas = async () => {
  try {
    const response = await axios.get(`${API_URL}/programas-personalizados`, { 
      headers: authHeaders() 
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener programas:', error);
    throw error;
  }
};

// Obtener un programa por su ID
const getProgramaById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/programas-personalizados/${id}`, { 
      headers: authHeaders() 
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener programa:', error);
    throw error;
  }
};

// Crear un nuevo programa personalizado
const createPrograma = async (programaData) => {
  try {
    const response = await axios.post(`${API_URL}/programas-personalizados`, programaData, { 
      headers: authHeaders() 
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear programa:', error);
    throw error;
  }
};

// Actualizar un programa existente
const updatePrograma = async (id, programaData) => {
  try {
    const response = await axios.put(`${API_URL}/programas-personalizados/${id}`, programaData, { 
      headers: authHeaders() 
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar programa:', error);
    throw error;
  }
};

// Eliminar un programa
const deletePrograma = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/programas-personalizados/${id}`, { 
      headers: authHeaders() 
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar programa:', error);
    throw error;
  }
};

// Verificar si un programa puede ser eliminado
const puedeEliminarPrograma = async (programaId) => {
  try {
    const response = await axios.get(`${API_URL}/programas-personalizados/${programaId}/puede-eliminar`, { 
      headers: authHeaders() 
    });
    return response.data;
  } catch (error) {
    console.error('Error al verificar si se puede eliminar el programa:', error);
    throw error;
  }
};

// Obtener subprogramas de un programa
const getSubprogramasByProgramaId = async (programaId) => {
  try {
    const response = await axios.get(`${API_URL}/programas-personalizados/${programaId}/subprogramas`, { 
      headers: authHeaders() 
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener subprogramas:', error);
    throw error;
  }
};

// Crear un nuevo subprograma
const createSubprograma = async (programaId, subprogramaData) => {
  try {
    const response = await axios.post(`${API_URL}/programas-personalizados/${programaId}/subprogramas`, subprogramaData, { 
      headers: authHeaders() 
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear subprograma:', error);
    throw error;
  }
};

// Actualizar un subprograma
const updateSubprograma = async (programaId, subprogramaId, subprogramaData) => {
  try {
    const response = await axios.put(`${API_URL}/programas-personalizados/${programaId}/subprogramas/${subprogramaId}`, subprogramaData, { 
      headers: authHeaders() 
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar subprograma:', error);
    throw error;
  }
};

// Eliminar un subprograma
const deleteSubprograma = async (programaId, subprogramaId) => {
  try {
    const response = await axios.delete(`${API_URL}/programas-personalizados/${programaId}/subprogramas/${subprogramaId}`, { 
      headers: authHeaders() 
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar subprograma:', error);
    throw error;
  }
};

// Generar tokens para múltiples pacientes
const generarTokensParaPacientes = async (programaId, pacientesIds) => {
  try {
    const response = await axios.post(`${API_URL}/programas-personalizados/${programaId}/generar-tokens`, 
      { pacientesIds }, 
      { headers: authHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al generar tokens:', error);
    throw error;
  }
};

// Obtener programa por token (acceso público)
const getProgramaByToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/acceso-programa?token=${token}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener programa por token:', error);
    throw error;
  }
};

// Enviar comentario de paciente para un subprograma (acceso público)
const enviarComentarioSubprograma = async (comentarioData) => {
  try {
    const response = await axios.post(`${API_URL}/acceso-programa/comentario`, comentarioData);
    return response.data;
  } catch (error) {
    console.error('Error al enviar comentario:', error);
    throw error;
  }
};

// Obtener comentarios por token y subprograma (acceso público)
const getComentariosByTokenAndSubprograma = async (token, subprogramaId) => {
  try {
    const response = await axios.get(`${API_URL}/acceso-programa/comentarios?token=${token}&subprogramaId=${subprogramaId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    throw error;
  }
};

export default {
  getProgramas,
  getProgramaById,
  createPrograma,
  updatePrograma,
  deletePrograma,
  puedeEliminarPrograma,
  getSubprogramasByProgramaId,
  createSubprograma,
  updateSubprograma,
  deleteSubprograma,
  generarTokensParaPacientes,
  getProgramaByToken,
  enviarComentarioSubprograma,
  getComentariosByTokenAndSubprograma
}; 