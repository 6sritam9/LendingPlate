package com.trustlend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateItemRequest {
    @NotBlank
    private String name;

    private String description;

    private String category;
}
