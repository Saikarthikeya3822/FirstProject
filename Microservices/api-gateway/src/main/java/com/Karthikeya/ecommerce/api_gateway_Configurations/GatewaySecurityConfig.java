package com.Karthikeya.ecommerce.api_gateway_Configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity        // ⚠️ Gateway uses WebFlux, NOT WebMvc
public class GatewaySecurityConfig {

    public GatewaySecurityConfig() {
        System.out.println("GatewaySecurityConfig loaded");
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())
            .httpBasic(httpBasic -> httpBasic.disable())      // ✅ stops generated password
            .formLogin(formLogin -> formLogin.disable())      // ✅ disables login page
            .authorizeExchange(exchange -> exchange
                .anyExchange().permitAll()                    // ✅ allow everything for now
            );
        return http.build();
    }
}
