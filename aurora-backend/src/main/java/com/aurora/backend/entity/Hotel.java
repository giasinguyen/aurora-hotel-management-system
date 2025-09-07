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
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String name;
    String code;
    String address;
    String phone;
    String checkInTime;
    String checkOutTime;

    @OneToMany(mappedBy = "hotel")
    Set<Room> rooms;
}
