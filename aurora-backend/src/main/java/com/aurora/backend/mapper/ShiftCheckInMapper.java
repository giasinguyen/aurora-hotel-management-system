package com.aurora.backend.mapper;

import com.aurora.backend.dto.response.ShiftCheckInResponse;
import com.aurora.backend.entity.ShiftCheckIn;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {StaffShiftMapper.class})
public interface ShiftCheckInMapper {
    
    @Mapping(target = "assignmentId", source = "assignment.id")
    @Mapping(target = "staffId", source = "staff.id")
    @Mapping(target = "staffName", expression = "java(checkIn.getStaff().getFirstName() + \" \" + checkIn.getStaff().getLastName())")
    @Mapping(target = "workingHours", expression = "java(checkIn.getWorkingHours())")
    @Mapping(target = "shiftName", source = "assignment.workShift.name")
    @Mapping(target = "shiftDate", source = "assignment.shiftDate")
    @Mapping(target = "shiftStartTime", source = "assignment.workShift.startTime")
    @Mapping(target = "shiftEndTime", source = "assignment.workShift.endTime")
    @Mapping(target = "isCurrentlyCheckedIn", expression = "java(checkIn.isCurrentlyCheckedIn())")
    ShiftCheckInResponse toResponse(ShiftCheckIn checkIn);
}
