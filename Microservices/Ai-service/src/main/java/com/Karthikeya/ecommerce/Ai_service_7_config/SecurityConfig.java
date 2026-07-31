package com.Karthikeya.ecommerce.Ai_service_7_config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(Customizer.withDefaults())

            .csrf(AbstractHttpConfigurer::disable)

            .authorizeHttpRequests(request -> request

                // Public endpoints if any
                .requestMatchers("/actuator/**","/db/**","/embedding/**")
                .permitAll()

                // AI endpoints secured
                .requestMatchers("/springai/**")
                .authenticated()

                .anyRequest()
                .authenticated()
            )

            .oauth2ResourceServer(oauth2 ->
                    oauth2.jwt(Customizer.withDefaults())
            )

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            );

        return http.build();
    }
}