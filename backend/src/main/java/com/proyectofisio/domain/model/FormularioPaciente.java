package com.proyectofisio.domain.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormularioPaciente {
    private Long id;
    private Long pacienteId;
    private LocalDate fechaEnvio;
    private String motivoConsulta;
    private String dolorActual;
    private String antecedentes;
    private String medicacion;
    private String objetivos;
    private Boolean aceptaPolitica;
} 