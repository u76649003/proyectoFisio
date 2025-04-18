package com.proyectofisio.infrastructure.adapters.output.persistence.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pacientes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false)
    private String apellidos;
    
    private String email;
    
    private String telefono;
    
    @Column(unique = true)
    private String dni;
    
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;
    
    private String direccion;
    
    private String sexo;
    
    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private EmpresaEntity empresa;
    
    @Column(name = "fecha_alta")
    private LocalDate fechaAlta;
    
    @OneToOne(mappedBy = "paciente")
    private HistorialClinicoEntity historialClinico;
    
    @OneToMany(mappedBy = "paciente")
    private List<FormularioPacienteEntity> formularios;
    
    @OneToMany(mappedBy = "paciente")
    private List<AgendaEntity> citas;
    
    @OneToMany(mappedBy = "paciente")
    private List<FacturaEntity> facturas;
    
    @OneToMany(mappedBy = "paciente")
    private List<SesionTratamientoEntity> sesiones;
    
    @OneToMany(mappedBy = "paciente")
    private List<BonoPacienteEntity> bonos;
    
    @OneToMany(mappedBy = "paciente")
    private List<MensajeEnviadoEntity> mensajes;
} 