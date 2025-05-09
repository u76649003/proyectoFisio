// Obtener programas compartidos con el paciente y sus comentarios
const getProgramasCompartidosConPaciente = async (pacienteId) => {
  try {
    const response = await axios.get(`${API_URL}/pacientes/${pacienteId}/programas-compartidos`, { 
      headers: authHeaders() 
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener programas compartidos con el paciente:', error);
    throw error;
  }
};

export default {
  getProgramasCompartidosConPaciente,
}; 