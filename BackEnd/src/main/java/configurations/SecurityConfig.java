package configurations;

//package com.telusko.part29springsecex.config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	  public SecurityConfig() {
	        System.out.println("✅ SecurityConfig constructor loaded");
	    }

    @Autowired
    private UserDetailsService userDetailsService;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    	System.out.println("✅ SecurityFilterChain is being built...");
    	 http
         .cors(Customizer.withDefaults())
         .csrf(AbstractHttpConfigurer::disable)
         .authorizeHttpRequests(request -> request
             .requestMatchers("/login", "/register").permitAll()
             .anyRequest().authenticated()
         )
         .oauth2ResourceServer(oauth2 -> oauth2
                 .jwt(Customizer.withDefaults()) // Use the new API for JWT configuration
             )
         .httpBasic(Customizer.withDefaults())
         .formLogin(AbstractHttpConfigurer::disable)
         .sessionManagement(session -> session
             .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
         );

     return http.build();


    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
        provider.setUserDetailsService(userDetailsService);


        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();

    }


}
