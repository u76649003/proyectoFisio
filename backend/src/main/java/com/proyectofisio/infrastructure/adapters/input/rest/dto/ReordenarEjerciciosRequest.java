package com.proyectofisio.infrastructure.adapters.input.rest.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReordenarEjerciciosRequest {
    private List<Long> ejerciciosIds;
} 