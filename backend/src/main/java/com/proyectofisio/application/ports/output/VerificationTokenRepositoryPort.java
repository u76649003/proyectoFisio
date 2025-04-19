package com.proyectofisio.application.ports.output;

import java.util.Optional;

import com.proyectofisio.domain.model.VerificationToken;

public interface VerificationTokenRepositoryPort {

    VerificationToken save(VerificationToken token);
    
    Optional<VerificationToken> findByToken(String token);
    
    Optional<VerificationToken> findByEmail(String email);
    
    boolean existsByToken(String token);
    
    void deleteById(Long id);
} 