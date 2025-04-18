package com.proyectofisio.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracionEmpresa {
    private Long id;
    private Long empresaId;
    private String clave;
    private String valor;
} 