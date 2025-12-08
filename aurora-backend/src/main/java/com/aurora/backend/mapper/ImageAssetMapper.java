package com.aurora.backend.mapper;

import com.aurora.backend.dto.response.ImageAssetResponse;
import com.aurora.backend.entity.ImageAsset;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImageAssetMapper {
    ImageAssetResponse toImageAssetResponse(ImageAsset imageAsset);
}
