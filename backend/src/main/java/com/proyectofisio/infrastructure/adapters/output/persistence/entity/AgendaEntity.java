package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.time.LocalDate;
import java.time.LocalTime;

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
@Table(name = "agenda")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgendaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private PacienteEntity paciente;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;
    
    @Column(nullable = false)
    private LocalDate fecha;
    
    @Column(nullable = false)
    private LocalTime hora;
    
    @Column(nullable = false)
    private Integer duracion;
    
    @Column(nullable = false)
    private String estado;
    
    @Column(name = "tipo_sesion")
    private String tipoSesion;
    
    @Column(columnDefinition = "TEXT")
    private String notas;
} 