package com.aurora.backend.mapper;

import com.aurora.backend.dto.response.StaffShiftAssignmentResponse;
import com.aurora.backend.entity.StaffShiftAssignment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {WorkShiftMapper.class})
public interface StaffShiftMapper {
    
    @Mapping(target = "staffId", source = "staff.id")
    @Mapping(target = "staffName", expression = "java(assignment.getStaff().getFirstName() + \" \" + assignment.getStaff().getLastName())")
    @Mapping(target = "staffUsername", source = "staff.username")
    @Mapping(target = "workShiftId", source = "workShift.id")
    @Mapping(target = "workShiftName", source = "workShift.name")
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "assignedBy", source = "assignedBy.id")
    @Mapping(target = "assignedByName", expression = "java(assignment.getAssignedBy() != null ? assignment.getAssignedBy().getFirstName() + \" \" + assignment.getAssignedBy().getLastName() : null)")
    @Mapping(target = "startTime", source = "workShift.startTime")
    @Mapping(target = "endTime", source = "workShift.endTime")
    @Mapping(target = "shiftColorCode", source = "workShift.colorCode")
    @Mapping(target = "hasCheckedIn", ignore = true)
    @Mapping(target = "checkInTime", ignore = true)
    @Mapping(target = "checkOutTime", ignore = true)
    StaffShiftAssignmentResponse toResponse(StaffShiftAssignment assignment);
}
