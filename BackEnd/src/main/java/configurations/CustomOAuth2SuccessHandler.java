package configurations;

import org.springframework.security.core.Authentication;

import java.net.URLEncoder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.ecommerce.UserRepo;
import com.example.ecommerce.model.Users;
import com.example.ecommerce.service.JWTService;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component // ✅ This makes it a Spring-managed bean
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {
	@Autowired
    private JWTService jwtService;
	 @Autowired
	 private UserRepo userRepository; // Your JPA repository

	@Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // You can extract email or any unique username field
        String email = oAuth2User.getAttribute("email");
        String pictureUrl = oAuth2User.getAttribute("picture"); // ✅ from Google profile
        String name = oAuth2User.getAttribute("name");   // Google full name
     // Check if user exists in DB
        Users user = userRepository.findByUsername(name);
        if (user == null) {
            // Save new user if not present
            user = new Users();
            //user.setUsername(email); // Here username = email
            user.setUsername(name);
            user.setRole("USER"); // default role
            userRepository.save(user);
        }
        // ✅ Use your custom token generator
        String token = jwtService.generateToken(name);
        System.out.println("Oauth2 generated token is:"+token);
        System.out.println(oAuth2User.getAttributes());

        // Redirect to frontend with token
        try {
        	response.sendRedirect("http://localhost:3000/home?token=" + token + "&picture=" + URLEncoder.encode(pictureUrl, "UTF-8"));
		} catch (java.io.IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
}
}
