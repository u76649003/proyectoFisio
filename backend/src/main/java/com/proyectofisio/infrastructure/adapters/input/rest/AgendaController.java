package com.proyectofisio.infrastructure.adapters.input.rest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.proyectofisio.application.ports.input.AgendaServicePort;
import com.proyectofisio.domain.model.Agenda;
import com.proyectofisio.domain.model.Agenda.EstadoCita;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.AgendaRequest;
import com.proyectofisio.infrastructure.adapters.input.rest.dto.MessageResponse;
import com.proyectofisio.infrastructure.adapters.input.rest.docs.AgendaControllerDocs;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/agenda")
@RequiredArgsConstructor
public class AgendaController implements AgendaControllerDocs {

    private final AgendaServicePort agendaServicePort;

    @Override
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<Agenda> crearCita(@RequestBody AgendaRequest agendaRequest) {
        Agenda agenda = Agenda.builder()
                .pacienteId(Long.valueOf(agendaRequest.getPacienteId()))
                .usuarioId(Long.valueOf(agendaRequest.getProfesionalId()))
                .fecha(LocalDate.parse(agendaRequest.getFechaHoraInicio().split("T")[0]))
                .hora(LocalDateTime.parse(agendaRequest.getFechaHoraInicio(), DateTimeFormatter.ISO_DATE_TIME).toLocalTime())
                .duracion(calcularDuracion(agendaRequest.getFechaHoraInicio(), agendaRequest.getFechaHoraFin()))
                .salaId(Long.valueOf(agendaRequest.getSalaId()))
                .servicioId(Long.valueOf(agendaRequest.getServicioId()))
                .notas(agendaRequest.getObservaciones())
                .estado(agendaRequest.getEstado() != null ? agendaRequest.getEstado() : EstadoCita.PENDIENTE.name())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(agendaServicePort.crearCita(agenda));
    }

    @Override
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA') or hasAuthority('PACIENTE')")
    public ResponseEntity<Agenda> getCitaById(@PathVariable Long id) {
        return ResponseEntity.ok(agendaServicePort.getCitaById(id));
    }

    @Override
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<List<Agenda>> getAllCitas() {
        return ResponseEntity.ok(agendaServicePort.getAllCitas());
    }

    @Override
    @GetMapping("/paciente/{pacienteId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA') or hasAuthority('PACIENTE')")
    public ResponseEntity<List<Agenda>> getCitasByPacienteId(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(agendaServicePort.getCitasByPacienteId(pacienteId));
    }

    @Override
    @GetMapping("/profesional/{profesionalId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<List<Agenda>> getCitasByProfesionalId(@PathVariable Long profesionalId) {
        return ResponseEntity.ok(agendaServicePort.getCitasByProfesionalId(profesionalId));
    }

    @Override
    @GetMapping("/fecha")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<List<Agenda>> getCitasByFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(agendaServicePort.getCitasByFecha(fecha));
    }

    @Override
    @GetMapping("/rango")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<List<Agenda>> getCitasByRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        return ResponseEntity.ok(agendaServicePort.getCitasByRangoFechas(fechaInicio, fechaFin));
    }

    @Override
    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<List<Agenda>> getCitasByEmpresaId(@PathVariable Long empresaId) {
        return ResponseEntity.ok(agendaServicePort.getCitasByEmpresaId(empresaId));
    }

    @Override
    @GetMapping("/sala/{salaId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<List<Agenda>> getCitasBySalaId(@PathVariable Long salaId) {
        return ResponseEntity.ok(agendaServicePort.getCitasBySalaId(salaId));
    }

    @Override
    @GetMapping("/servicio/{servicioId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<List<Agenda>> getCitasByServicioId(@PathVariable Long servicioId) {
        return ResponseEntity.ok(agendaServicePort.getCitasByServicioId(servicioId));
    }

    @Override
    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<List<Agenda>> getCitasByEstado(@PathVariable String estado) {
        return ResponseEntity.ok(agendaServicePort.getCitasByEstado(EstadoCita.valueOf(estado)));
    }

    @Override
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<Agenda> updateCita(@PathVariable Long id, @RequestBody AgendaRequest agendaRequest) {
        Agenda agenda = Agenda.builder()
                .id(id)
                .pacienteId(Long.valueOf(agendaRequest.getPacienteId()))
                .usuarioId(Long.valueOf(agendaRequest.getProfesionalId()))
                .fecha(LocalDate.parse(agendaRequest.getFechaHoraInicio().split("T")[0]))
                .hora(LocalDateTime.parse(agendaRequest.getFechaHoraInicio(), DateTimeFormatter.ISO_DATE_TIME).toLocalTime())
                .duracion(calcularDuracion(agendaRequest.getFechaHoraInicio(), agendaRequest.getFechaHoraFin()))
                .salaId(Long.valueOf(agendaRequest.getSalaId()))
                .servicioId(Long.valueOf(agendaRequest.getServicioId()))
                .notas(agendaRequest.getObservaciones())
                .estado(agendaRequest.getEstado() != null ? agendaRequest.getEstado() : EstadoCita.PENDIENTE.name())
                .build();

        return ResponseEntity.ok(agendaServicePort.updateCita(id, agenda));
    }

    @Override
    @PutMapping("/{id}/cancelar")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA') or hasAuthority('PACIENTE')")
    public ResponseEntity<Agenda> cancelarCita(@PathVariable Long id) {
        return ResponseEntity.ok(agendaServicePort.cancelarCita(id));
    }

    @Override
    @PutMapping("/{id}/completar")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA')")
    public ResponseEntity<Agenda> completarCita(@PathVariable Long id) {
        return ResponseEntity.ok(agendaServicePort.completarCita(id));
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('FISIOTERAPEUTA') or hasAuthority('RECEPCIONISTA')")
    public ResponseEntity<MessageResponse> deleteCita(@PathVariable Long id) {
        agendaServicePort.deleteCita(id);
        return ResponseEntity.ok(new MessageResponse("Cita eliminada correctamente"));
    }
    
    /**
     * Calcula la duración en minutos entre dos fechas-hora
     * @param fechaHoraInicio Fecha y hora de inicio en formato ISO
     * @param fechaHoraFin Fecha y hora de fin en formato ISO
     * @return Duración en minutos
     */
    private Integer calcularDuracion(String fechaHoraInicio, String fechaHoraFin) {
        LocalDateTime inicio = LocalDateTime.parse(fechaHoraInicio, DateTimeFormatter.ISO_DATE_TIME);
        LocalDateTime fin = LocalDateTime.parse(fechaHoraFin, DateTimeFormatter.ISO_DATE_TIME);
        return (int) java.time.Duration.between(inicio, fin).toMinutes();
    }
} 