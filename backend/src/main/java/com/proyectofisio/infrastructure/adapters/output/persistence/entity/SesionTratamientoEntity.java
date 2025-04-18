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
@Table(name = "sesiones_tratamiento")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SesionTratamientoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private PacienteEntity paciente;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;
    
    @Column(nullable = false)
    private LocalDate fecha;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(name = "tecnicas_aplicadas", columnDefinition = "TEXT")
    private String tecnicasAplicadas;
    
    @Column(columnDefinition = "TEXT")
    private String recomendaciones;
    
    @Column(columnDefinition = "TEXT")
    private String evolucion;
    
    @Column(name = "adjuntos_url")
    private String adjuntosUrl;
} 