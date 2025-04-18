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
@Table(name = "bonos_paciente")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BonoPacienteEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private PacienteEntity paciente;
    
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private ProductoEntity producto;
    
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;
    
    @Column(name = "total_sesiones", nullable = false)
    private Integer totalSesiones;
    
    @Column(name = "sesiones_utilizadas", nullable = false)
    private Integer sesionesUtilizadas;
    
    @Column(nullable = false)
    private Boolean activo;
} 