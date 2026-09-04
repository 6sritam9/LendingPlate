package com.trustlend.controller;

import com.trustlend.dto.CreateItemRequest;
import com.trustlend.dto.ItemResponse;
import com.trustlend.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    public ResponseEntity<List<ItemResponse>> browse(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(itemService.browseAvailable(category));
    }

    @PostMapping
    public ResponseEntity<ItemResponse> create(@Valid @RequestBody CreateItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemService.createItem(request));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ItemResponse>> mine() {
        return ResponseEntity.ok(itemService.getMyItems());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
