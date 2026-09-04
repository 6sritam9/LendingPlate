package com.trustlend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponse {
    private Long id;
    private String name;
    private String description;
    private String category;
    private boolean available;
    private Long ownerId;
    private String ownerName;
    private String ownerNeighborhood;
}
