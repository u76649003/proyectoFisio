package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.time.LocalDateTime;

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
@Table(name = "mensajes_enviados")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MensajeEnviadoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private PacienteEntity paciente;
    
    @Column(nullable = false)
    private String tipo;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenido;
    
    @Column(name = "fecha_envio", nullable = false)
    private LocalDateTime fechaEnvio;
    
    @Column(nullable = false)
    private String estado;
    
    @Column(name = "referencia_id")
    private Long referenciaId;
} 