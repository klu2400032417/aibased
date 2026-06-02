package com.klef.resumedetector.repository;

import com.klef.resumedetector.entity.User;
import com.klef.resumedetector.entity.User.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // used by Spring Security during login
    Optional<User> findByEmail(String email);

    // check duplicate email before register
    boolean existsByEmail(String email);

    // get all users by role (e.g. all CANDIDATEs)
    List<User> findByRole(Role role);

    // search user by name (case-insensitive)
    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> searchByName(@Param("name") String name);
}