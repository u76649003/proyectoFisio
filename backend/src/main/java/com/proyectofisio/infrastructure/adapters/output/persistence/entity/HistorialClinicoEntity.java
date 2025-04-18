package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "historiales_clinicos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistorialClinicoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private PacienteEntity paciente;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(columnDefinition = "TEXT")
    private String diagnostico;
    
    @Column(columnDefinition = "TEXT")
    private String tratamiento;
    
    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;
    
    @Column(name = "fecha_ultima_actualizacion")
    private LocalDate fechaUltimaActualizacion;
    
    @Column(name = "documentos_url")
    private String documentosUrl;
} 