package com.proyectofisio.application.services;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyectofisio.application.ports.input.VerificationTokenServicePort;
import com.proyectofisio.application.ports.output.VerificationTokenRepositoryPort;
import com.proyectofisio.domain.model.VerificationToken;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VerificationTokenService implements VerificationTokenServicePort {

    private final VerificationTokenRepositoryPort verificationTokenRepository;
    
    @Value("${app.verification.token.expiration:24}")
    private int tokenExpirationHours;

    @Override
    @Transactional
    public String crearToken(String email, Long usuarioId) {
        // Verificar si ya existe un token para este email y eliminarlo
        Optional<VerificationToken> tokenExistente = verificationTokenRepository.findByEmail(email);
        if (tokenExistente.isPresent()) {
            verificationTokenRepository.deleteById(tokenExistente.get().getId());
        }
        
        // Generar un nuevo token
        String tokenValue = UUID.randomUUID().toString();
        
        // Crear objeto token
        VerificationToken token = VerificationToken.builder()
                .token(tokenValue)
                .email(email)
                .usuarioId(usuarioId)
                .fechaCreacion(LocalDateTime.now())
                .fechaExpiracion(LocalDateTime.now().plusHours(tokenExpirationHours))
                .usado(false)
                .build();
        
        // Guardar el token
        verificationTokenRepository.save(token);
        
        return tokenValue;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean esValido(String token) {
        Optional<VerificationToken> tokenOpt = verificationTokenRepository.findByToken(token);
        
        if (tokenOpt.isEmpty()) {
            return false;
        }
        
        VerificationToken verificationToken = tokenOpt.get();
        
        // Verificar si ya ha sido usado
        if (verificationToken.isUsado()) {
            return false;
        }
        
        // Verificar si ha expirado
        if (verificationToken.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            return false;
        }
        
        return true;
    }

    @Override
    @Transactional
    public boolean marcarComoUsado(String token) {
        Optional<VerificationToken> tokenOpt = verificationTokenRepository.findByToken(token);
        
        if (tokenOpt.isEmpty()) {
            return false;
        }
        
        VerificationToken verificationToken = tokenOpt.get();
        
        // Verificar si ya ha sido usado
        if (verificationToken.isUsado()) {
            return false;
        }
        
        // Marcar como usado
        verificationToken.setUsado(true);
        verificationTokenRepository.save(verificationToken);
        
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<VerificationToken> buscarPorToken(String token) {
        return verificationTokenRepository.findByToken(token);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<VerificationToken> buscarPorEmail(String email) {
        return verificationTokenRepository.findByEmail(email);
    }
} 