/*
package com.kick_off.kick_off.service.authentication;

import com.kick_off.kick_off.model.authentication.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtUtils {
    private SecretKey key;
    private static final long ACCESS_TOKEN_EXPIRATION = 60 * 1000;      // 1 minutes
    private static final long REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days


    public JwtUtils() {
        // ---- !? secretString !? ----
        // zasto ga koristim
        String secretString = "cd666237c14efa11eee03cc2a061f3bb539596e06b209da865ff10c82b0afd097ed0d55b423bdebeb632b82570eaae26ff7dbd211fd5b3ea8d5947e2491811bb8f81afacbba1ae5bfa9ee52b8531046817647f1f1027c99fb70d40e42e966f1bddd47bb5e5dfea5f296bd69c884be017237430706da9a5f50e36e8a6ffded476ab90fc68dcab77e52ee491c6a57589b669e7b5c827297490f60a3a36623db2a7599b596f765d0f450c53a3d3757f9f3cd6900e270ad7774999ef43ce6e4f32c7e657f5224b87b8815380052decd8107b5137fa009656a2a0d49a65b7a9f826d8a194c5e2dfa222dbc1dc25ed76a914995ecb11779fdea58391700dd90b5e42f0";
        byte[] keyBytes = Base64.getDecoder().decode(secretString.getBytes(StandardCharsets.UTF_8));
        this.key = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    public String generateToken(User userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername()) // identifies the user
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .claim("role", userDetails.getRole())
                .claim("userId", userDetails.getId())
                .signWith(key, SignatureAlgorithm.HS256) // sign token with secret key
                .compact(); //  Builds and returns the JWT as a compact, URL-safe string.
    }

    // *** HashMap<String, Objects> claims ---> Allows adding custom data (claims) to the token(e.g. role, session).
    public String generateRefreshToken(HashMap<String, Objects> claims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(claims) // Embeds the extra claims (if any) into the token payload.
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token, Claims::getSubject);
    }

    // If the token is expired, the method returns true.(else it returns false)
    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {
        return claimsTFunction.apply(
                Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload());
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }
}
*/
