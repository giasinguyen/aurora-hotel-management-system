package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.BranchCreationRequest;
import com.aurora.backend.dto.request.BranchUpdateRequest;
import com.aurora.backend.dto.response.BranchResponse;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.Room;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BranchMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "manager", ignore = true) // Set trong service
    @Mapping(target = "rooms", ignore = true)
    @Mapping(target = "facilities", ignore = true)
    @Mapping(target = "staff", ignore = true)
    Branch toBranch(BranchCreationRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "code", ignore = true) // Code không được update
    @Mapping(target = "manager", ignore = true) // Set trong service
    @Mapping(target = "rooms", ignore = true)
    @Mapping(target = "facilities", ignore = true)
    @Mapping(target = "staff", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBranch(@MappingTarget Branch branch, BranchUpdateRequest request);
    
    @Mapping(target = "managerId", source = "manager.id")
    @Mapping(target = "managerName", expression = "java(getManagerFullName(branch))")
    @Mapping(target = "managerUsername", source = "manager.username")
    @Mapping(target = "fullAddress", expression = "java(getFullAddress(branch))")
    @Mapping(target = "totalRooms", expression = "java(getTotalRooms(branch))")
    @Mapping(target = "totalStaff", expression = "java(getTotalStaff(branch))")
    @Mapping(target = "availableRooms", expression = "java(getAvailableRooms(branch))")
    BranchResponse toBranchResponse(Branch branch);
    
    // Helper methods
    default String getManagerFullName(Branch branch) {
        if (branch.getManager() == null) return null;
        return branch.getManager().getFirstName() + " " + branch.getManager().getLastName();
    }
    
    default String getFullAddress(Branch branch) {
        return String.format("%s, %s, %s, %s", 
            branch.getAddress(), 
            branch.getWard(), 
            branch.getDistrict(), 
            branch.getCity());
    }
    
    default Integer getTotalRooms(Branch branch) {
        return branch.getRooms() != null ? branch.getRooms().size() : 0;
    }
    
    default Integer getTotalStaff(Branch branch) {
        return branch.getStaff() != null ? branch.getStaff().size() : 0;
    }
    
    default Integer getAvailableRooms(Branch branch) {
        if (branch.getRooms() == null) return 0;
        return (int) branch.getRooms().stream()
            .filter(room -> Room.RoomStatus.AVAILABLE.equals(room.getStatus()))
            .count();
    }
}
