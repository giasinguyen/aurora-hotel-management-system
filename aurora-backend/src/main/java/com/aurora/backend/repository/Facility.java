package com.aurora.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Facility extends JpaRepository<Facility,Integer> {
}
