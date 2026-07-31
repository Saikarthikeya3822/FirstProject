package com.Karthikeya.ecommerce.Ai_service_8_util;

import java.util.Base64;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class SecurityUtil {

	private SecurityUtil() {
	}

	public static String getTokenFromSecurityContext() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null) {
			throw new RuntimeException("No authentication found");
		}

		if (authentication instanceof JwtAuthenticationToken jwtAuth) {
			return jwtAuth.getToken().getTokenValue();
		}

		throw new RuntimeException("Invalid authentication type");
	}

	public static String getUserId() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		JwtAuthenticationToken jwtToken = (JwtAuthenticationToken) authentication;

		return jwtToken.getToken().getSubject();
	}
	public static String getUserIdFromToken(
	        String token
	) {

	    try {

	        token = token.replace(
	                "Bearer ",
	                ""
	        );

	        String[] chunks =
	                token.split("\\.");

	        Base64.Decoder decoder =
	                Base64.getUrlDecoder();

	        String payload =
	                new String(
	                        decoder.decode(
	                                chunks[1]
	                        )
	                );

	        ObjectMapper mapper =
	                new ObjectMapper();

	        JsonNode jsonNode =
	                mapper.readTree(payload);

	        return jsonNode
	                .get("sub")
	                .asText();

	    }
	    catch (Exception e) {

	        throw new RuntimeException(
	                "Unable to extract userId from token"
	        );
	    }
	}
}