package com.proyectofisio.infrastructure.adapters.output.persistence;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.proyectofisio.application.ports.output.VerificationTokenRepositoryPort;
import com.proyectofisio.domain.model.VerificationToken;
import com.proyectofisio.infrastructure.adapters.output.persistence.mapper.VerificationTokenMapper;
import com.proyectofisio.infrastructure.adapters.output.persistence.repository.VerificationTokenRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VerificationTokenJpaAdapter implements VerificationTokenRepositoryPort {

    private final VerificationTokenRepository verificationTokenRepository;
    private final VerificationTokenMapper verificationTokenMapper;

    @Override
    public VerificationToken save(VerificationToken token) {
        var entity = verificationTokenMapper.toEntity(token);
        var savedEntity = verificationTokenRepository.save(entity);
        return verificationTokenMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<VerificationToken> findByToken(String token) {
        return verificationTokenRepository.findByToken(token)
                .map(verificationTokenMapper::toDomain);
    }

    @Override
    public Optional<VerificationToken> findByEmail(String email) {
        return verificationTokenRepository.findByEmail(email)
                .map(verificationTokenMapper::toDomain);
    }

    @Override
    public boolean existsByToken(String token) {
        return verificationTokenRepository.existsByToken(token);
    }

    @Override
    public void deleteById(Long id) {
        verificationTokenRepository.deleteById(id);
    }
} 