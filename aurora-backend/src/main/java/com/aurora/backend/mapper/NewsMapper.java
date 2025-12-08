package com.aurora.backend.mapper;

import com.aurora.backend.dto.request.NewsCreationRequest;
import com.aurora.backend.dto.request.NewsUpdateRequest;
import com.aurora.backend.dto.response.NewsListResponse;
import com.aurora.backend.dto.response.NewsResponse;
import com.aurora.backend.entity.News;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {ImageAssetMapper.class})
public interface NewsMapper {
    @Mapping(target = "id", ignore = true)
    News toNews(NewsCreationRequest request);
    
    NewsResponse toNewsResponse(News news);
    
    NewsListResponse toNewsListResponse(News news);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "images", ignore = true)
    void updateNewsFromRequest(NewsUpdateRequest request, @MappingTarget News news);
}
