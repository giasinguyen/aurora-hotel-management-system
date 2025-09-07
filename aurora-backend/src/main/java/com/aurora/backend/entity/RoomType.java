package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class RoomType {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    Hotel hotel;

    @Column(nullable = false)
    String name;   // Deluxe, Suite...
    String code;
    Integer capacityAdults;
    Integer capacityChildren;
    Double sizeM2;
    Boolean refundable;

    @OneToMany(mappedBy = "roomType")
    Set<Room> rooms;

    @ManyToMany
    @JoinTable(name = "room_type_amenities",
            joinColumns = @JoinColumn(name = "room_type_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id"))
    Set<Amenity> amenities;
}
