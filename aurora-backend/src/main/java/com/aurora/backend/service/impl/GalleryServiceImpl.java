package com.aurora.backend.service.impl;

import com.aurora.backend.dto.response.GalleryImageResponse;
import com.aurora.backend.entity.Room;
import com.aurora.backend.repository.RoomRepository;
import com.aurora.backend.repository.ServiceRepository;
import com.aurora.backend.service.GalleryService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class GalleryServiceImpl implements GalleryService {

    RoomRepository roomRepository;
    ServiceRepository serviceRepository;

    @Override
    @Transactional(readOnly = true)
    public List<GalleryImageResponse> getGalleryImages(int maxImages) {
        log.info("Fetching gallery images, max: {}", maxImages);
        
        List<GalleryImageResponse> galleryImages = new ArrayList<>();
        
        // Calculate how many images to get from each source
        int roomImagesCount = maxImages / 2; // 12 images from rooms
        int serviceImagesCount = maxImages / 2; // 12 images from services
        
        // Fetch rooms with images (only active, non-deleted rooms)
        List<Room> rooms = roomRepository.findAll().stream()
                .filter(room -> room.getDeleted() == null || !room.getDeleted())
                .filter(room -> room.getImages() != null && !room.getImages().isEmpty())
                .toList();
        
        // Collect images from rooms
        int roomImagesCollected = 0;
        for (Room room : rooms) {
            if (roomImagesCollected >= roomImagesCount) break;
            
            if (room.getImages() != null && !room.getImages().isEmpty()) {
                for (String imageUrl : room.getImages()) {
                    if (roomImagesCollected >= roomImagesCount) break;
                    if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                        galleryImages.add(GalleryImageResponse.builder()
                                .imageUrl(imageUrl)
                                .sourceType("ROOM")
                                .sourceId(room.getId())
                                .sourceName(room.getRoomNumber() + " - " + 
                                        (room.getRoomType() != null ? room.getRoomType().getName() : "Room"))
                                .build());
                        roomImagesCollected++;
                    }
                }
            }
        }
        
        // Fetch services with images (only active services)
        List<com.aurora.backend.entity.Service> services = serviceRepository.findAll().stream()
                .filter(service -> service.getActive() != null && service.getActive())
                .filter(service -> service.getDeleted() == null || !service.getDeleted())
                .filter(service -> service.getImages() != null && !service.getImages().isEmpty())
                .toList();
        
        // Collect images from services
        int serviceImagesCollected = 0;
        for (com.aurora.backend.entity.Service service : services) {
            if (serviceImagesCollected >= serviceImagesCount) break;
            
            if (service.getImages() != null && !service.getImages().isEmpty()) {
                for (String imageUrl : service.getImages()) {
                    if (serviceImagesCollected >= serviceImagesCount) break;
                    if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                        galleryImages.add(GalleryImageResponse.builder()
                                .imageUrl(imageUrl)
                                .sourceType("SERVICE")
                                .sourceId(service.getId())
                                .sourceName(service.getName())
                                .build());
                        serviceImagesCollected++;
                    }
                }
            }
        }
        
        log.info("Collected {} gallery images ({} from rooms, {} from services)", 
                galleryImages.size(), roomImagesCollected, serviceImagesCollected);
        
        return galleryImages;
    }
}

