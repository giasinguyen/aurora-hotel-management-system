package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "documents")
public class Document extends BaseEntity {
    
    @Column(nullable = false)
    String filename;
    
    @Column(nullable = false)
    String fileType;
    
    @Column(nullable = false)
    Long size;
    
    @Column(nullable = false)
    String docUrl;
    
    @Column(nullable = false)
    String publicId;
    
    @Column(nullable = false)
    @Builder.Default
    Boolean isEmbed = false;
    
    Integer totalChunks;
    
    @Column(columnDefinition = "TEXT")
    String metadata;
    
    @Column(columnDefinition = "TEXT")
    String description;
}
