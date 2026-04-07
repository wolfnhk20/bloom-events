package com.smartevent.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.smartevent.model.User;

import com.smartevent.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    @Value("${app.supabase.jwt-secret}")
    private String jwtSecret;

    @Value("${app.admin.emails}")
    private String adminEmails;

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            DecodedJWT jwt = JWT.decode(token);

            String userId = jwt.getSubject();
            String email = jwt.getClaim("email").asString();

            // Upsert user in our DB
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = User.builder()
                                .id(UUID.fromString(userId))
                                .email(email)
                                .fullName(jwt.getClaim("user_metadata").asMap() != null
                                        ? (String) jwt.getClaim("user_metadata").asMap().getOrDefault("full_name", email)
                                        : email)
                                .role(isAdmin(email) ? User.Role.ADMIN : User.Role.USER)
                                .build();
                        return userRepository.save(newUser);
                    });

            List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
            );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(user, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (JWTVerificationException e) {
            log.warn("JWT verification failed: {}", e.getMessage());

            filterChain.doFilter(request, response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAdmin(String email) {
        if (adminEmails == null) return false;
        for (String adminEmail : adminEmails.split(",")) {
            if (adminEmail.trim().equalsIgnoreCase(email)) return true;
        }
        return false;
    }
}
