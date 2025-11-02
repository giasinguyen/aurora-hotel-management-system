package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.ReviewCreationRequest;
import com.aurora.backend.dto.request.ReviewUpdateRequest;
import com.aurora.backend.dto.response.ReviewResponse;
import com.aurora.backend.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReviewMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "booking", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "isVerified", ignore = true)
    @Mapping(target = "helpfulCount", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "reviewDate", ignore = true)
    @Mapping(target = "rejectionReason", ignore = true)
    @Mapping(target = "approvedAt", ignore = true)
    @Mapping(target = "approvedBy", ignore = true)
    @Mapping(target = "rejectedAt", ignore = true)
    @Mapping(target = "rejectedBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    Review toReview(ReviewCreationRequest request);
    
    @Mapping(target = "bookingId", source = "booking.id")
    @Mapping(target = "bookingCode", source = "booking.bookingCode")
    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", expression = "java(getCustomerFullName(review))")
    @Mapping(target = "customerAvatarUrl", source = "customer.avatarUrl")
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "roomNumber", source = "room.roomNumber")
    @Mapping(target = "status", expression = "java(review.getStatus().name())")
    ReviewResponse toReviewResponse(Review review);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "booking", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "isVerified", ignore = true)
    @Mapping(target = "helpfulCount", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "reviewDate", ignore = true)
    @Mapping(target = "rejectionReason", ignore = true)
    @Mapping(target = "approvedAt", ignore = true)
    @Mapping(target = "approvedBy", ignore = true)
    @Mapping(target = "rejectedAt", ignore = true)
    @Mapping(target = "rejectedBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void updateReview(@MappingTarget Review review, ReviewUpdateRequest request);
    
    default String getCustomerFullName(Review review) {
        if (review.getCustomer() == null) {
            return null;
        }
        String firstName = review.getCustomer().getFirstName();
        String lastName = review.getCustomer().getLastName();
        
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (firstName != null) {
            return firstName;
        } else if (lastName != null) {
            return lastName;
        }
        return review.getCustomer().getUsername();
    }
}

