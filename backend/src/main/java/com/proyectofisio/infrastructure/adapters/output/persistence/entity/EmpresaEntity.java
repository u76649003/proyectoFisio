package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "empresas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    private String direccion;
    
    private String telefono;
    
    private String email;
    
    @Column(unique = true)
    private String nif;
    
    private String web;
    
    @Column(name = "logo_url")
    private String logoUrl;
    
    @OneToMany(mappedBy = "empresa")
    private List<UsuarioEntity> usuarios;
    
    @OneToMany(mappedBy = "empresa")
    private List<PacienteEntity> pacientes;
    
    @OneToMany(mappedBy = "empresa")
    private List<FacturaEntity> facturas;
    
    @OneToMany(mappedBy = "empresa")
    private List<ConfiguracionEmpresaEntity> configuraciones;
} 