package com.aurora.backend.mapper;

import com.aurora.backend.dto.response.WorkShiftResponse;
import com.aurora.backend.entity.WorkShift;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WorkShiftMapper {
    
    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "durationInHours", expression = "java(workShift.getDurationInHours())")
    WorkShiftResponse toResponse(WorkShift workShift);
}
