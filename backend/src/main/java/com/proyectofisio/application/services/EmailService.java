package com.proyectofisio.application.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.proyectofisio.application.ports.input.EmailServicePort;
import com.proyectofisio.domain.model.Usuario;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService implements EmailServicePort {

    private final JavaMailSender emailSender;
    private final TemplateEngine templateEngine;
    
    @Value("${app.email.from:fisioayuda.soporte@gmail.com}")
    private String fromEmail;
    
    @Value("${app.base-url:https://proyectofisio.onrender.com}")
    private String baseUrl;

    @Override
    public boolean enviarCorreoVerificacion(Usuario usuario, String token) {
        String asunto = "FisioAyuda - Verificación de cuenta";
        
        // Crear contexto para la plantilla
        Context context = new Context();
        context.setVariable("nombre", usuario.getNombre());
        context.setVariable("token", token);
        context.setVariable("verificacionUrl", baseUrl + "/verify-email/" + token);
        context.setVariable("logoUrl", baseUrl + "/logo.svg");
        
        // Procesar plantilla con la ruta correcta
        String contenido = templateEngine.process("email/email-verificacion", context);
        
        // Enviar correo
        return enviarCorreo(usuario.getEmail(), asunto, contenido);
    }

    @Override
    public boolean enviarCorreo(String destinatario, String asunto, String contenido) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(contenido, true); // El segundo parámetro indica que es HTML
            
            emailSender.send(message);
            log.info("Correo enviado correctamente a: {}", destinatario);
            return true;
        } catch (MessagingException e) {
            log.error("Error al enviar correo a {}: {}", destinatario, e.getMessage());
            return false;
        }
    }
} 