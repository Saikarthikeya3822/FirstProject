package com.example.ecommerce.service;

import java.util.Collections;
import java.util.List;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
//import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.ws.rs.core.Response;
@Service
public class KeycloakUserService {
	private final Keycloak keycloak;
    @Value("${keycloak.admin.realm}") // e.g., Ecommerce-Users
    private String appRealm;
	  public KeycloakUserService(Keycloak keycloak) {
	        this.keycloak = keycloak;
	    }
    public void registerUser(String username, String password) {
        //Keycloak keycloak = getInstance();
        RealmResource realmResource = keycloak.realm(appRealm);
        UsersResource usersResource = realmResource.users();
        // 🔹 Check if user already exists
        List<UserRepresentation> existingUsers;
        existingUsers = usersResource.search(username, true);
        if (!existingUsers.isEmpty()) {
        throw new RuntimeException("❌ User with username '" + username + "' already exists.");
        }
        // Create user representation
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEnabled(true);
        // Create user
        Response response = usersResource.create(user);
        if (response.getStatus() != 201) {
            throw new RuntimeException("❌ User creation failed: " + response.getStatus());
        }
        String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");
        // Set password
        CredentialRepresentation passwordCred = new CredentialRepresentation();
        passwordCred.setTemporary(false);
        passwordCred.setType(CredentialRepresentation.PASSWORD);
        passwordCred.setValue(password);      
        usersResource.get(userId).resetPassword(passwordCred);
        // Assign "user" role
        RoleRepresentation userRole = realmResource.roles().get("user").toRepresentation();
        usersResource.get(userId).roles().realmLevel().add(Collections.singletonList(userRole));
    }
}
