package com.aurora.backend.repository;

import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Service;
import com.aurora.backend.entity.ServiceBooking;
import com.aurora.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceBookingRepository extends JpaRepository<ServiceBooking, String> {
    
    Page<ServiceBooking> findByBooking(Booking booking, Pageable pageable);
    
    Page<ServiceBooking> findByService(Service service, Pageable pageable);
    
    Page<ServiceBooking> findByCustomer(User customer, Pageable pageable);
    
    Page<ServiceBooking> findByStatus(String status, Pageable pageable);
    
    boolean existsByBookingAndService(Booking booking, Service service);
    
    @Query("SELECT sb FROM ServiceBooking sb WHERE " +
           "(:booking IS NULL OR sb.booking = :booking) AND " +
           "(:service IS NULL OR sb.service = :service) AND " +
           "(:customer IS NULL OR sb.customer = :customer) AND " +
           "(:status IS NULL OR :status = '' OR sb.status = :status)")
    Page<ServiceBooking> findByFilters(@Param("booking") Booking booking,
                                     @Param("service") Service service,
                                     @Param("customer") User customer,
                                     @Param("status") String status,
                                     Pageable pageable);
}
