package com.proyectofisio.domain.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MensajeEnviado {
    private Long id;
    private Long pacienteId;
    private String tipo;
    private String contenido;
    private LocalDateTime fechaEnvio;
    private String estado;
    private Long referenciaId;
} 