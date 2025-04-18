package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.time.LocalDate;

import com.proyectofisio.domain.model.enums.RolUsuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "usuarios")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false)
    private String apellidos;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String telefono;
    
    @Column(unique = true)
    private String dni;
    
    @Column(name = "numero_colegiado")
    private String numeroColegiado;
    
    private String especialidad;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolUsuario rol;
    
    @Column(nullable = false)
    private String contraseña;
    
    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private EmpresaEntity empresa;
    
    @Column(name = "fecha_alta")
    private LocalDate fechaAlta;
} 