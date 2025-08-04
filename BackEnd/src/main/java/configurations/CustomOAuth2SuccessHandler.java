package configurations;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.ecommerce.service.JWTService;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component // ✅ This makes it a Spring-managed bean
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {
	@Autowired
    private JWTService jwtService;
	@Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // You can extract email or any unique username field
        String email = oAuth2User.getAttribute("email");

        // ✅ Use your custom token generator
        String token = jwtService.generateToken(email);

        // Redirect to frontend with token
        try {
			response.sendRedirect("http://localhost:3000/home?token=" + token);
		} catch (java.io.IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
}
}
