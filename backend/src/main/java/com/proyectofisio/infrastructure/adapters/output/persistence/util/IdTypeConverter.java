package com.proyectofisio.infrastructure.adapters.output.persistence.util;

import java.util.UUID;

/**
 * Utilidad para convertir entre tipos de identificadores
 */
public class IdTypeConverter {

    /**
     * Convierte un UUID a un Long utilizando el hashCode
     * @param uuid El UUID a convertir
     * @return Un valor Long basado en el UUID o null si el UUID es null
     */
    public static Long uuidToLong(UUID uuid) {
        if (uuid == null) {
            return null;
        }
        return (long) uuid.hashCode();
    }

    /**
     * Convierte un Long a un UUID generando un UUID basado en el Long
     * @param id El Long a convertir
     * @return Un UUID basado en el Long o null si el Long es null
     */
    public static UUID longToUuid(Long id) {
        if (id == null) {
            return null;
        }
        // Usar una semilla consistente para generar el mismo UUID para el mismo Long
        return new UUID(0, id);
    }
} 