package com.proyectofisio.infrastructure.adapters.output.persistence.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectofisio.infrastructure.adapters.output.persistence.entity.VerificationTokenEntity;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationTokenEntity, Long> {
    
    Optional<VerificationTokenEntity> findByToken(String token);
    
    Optional<VerificationTokenEntity> findByEmail(String email);
    
    boolean existsByToken(String token);
} 