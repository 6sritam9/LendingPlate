package com.trustlend.repository;

import com.trustlend.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByAvailableTrue();
    List<Item> findByAvailableTrueAndCategoryIgnoreCase(String category);
    List<Item> findByOwnerId(Long ownerId);
}
