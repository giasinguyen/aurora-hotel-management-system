package com.aurora.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "document_content")
public class DocumentContent {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "document_id")
    private DocumentMetadata document;

    @Lob
    @Column(name = "content")
    private byte[] content;
}
