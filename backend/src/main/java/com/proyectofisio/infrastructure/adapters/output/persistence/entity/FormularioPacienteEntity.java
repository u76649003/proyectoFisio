package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "formularios_paciente")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormularioPacienteEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private PacienteEntity paciente;
    
    @Column(name = "fecha_envio")
    private LocalDate fechaEnvio;
    
    @Column(name = "motivo_consulta", columnDefinition = "TEXT")
    private String motivoConsulta;
    
    @Column(name = "dolor_actual", columnDefinition = "TEXT")
    private String dolorActual;
    
    @Column(columnDefinition = "TEXT")
    private String antecedentes;
    
    @Column(columnDefinition = "TEXT")
    private String medicacion;
    
    @Column(columnDefinition = "TEXT")
    private String objetivos;
    
    @Column(name = "acepta_politica")
    private Boolean aceptaPolitica;
} 