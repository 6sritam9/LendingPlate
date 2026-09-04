package com.trustlend.service;

import com.trustlend.dto.CreateItemRequest;
import com.trustlend.dto.ItemResponse;
import com.trustlend.entity.Item;
import com.trustlend.entity.User;
import com.trustlend.exception.BadRequestException;
import com.trustlend.exception.ResourceNotFoundException;
import com.trustlend.repository.ItemRepository;
import com.trustlend.repository.LoanRequestRepository;
import com.trustlend.entity.enums.LoanStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final LoanRequestRepository loanRequestRepository;
    private final CurrentUserService currentUserService;

    public List<ItemResponse> browseAvailable(String category) {
        List<Item> items = (category == null || category.isBlank())
                ? itemRepository.findByAvailableTrue()
                : itemRepository.findByAvailableTrueAndCategoryIgnoreCase(category);
        return items.stream().map(this::toDto).toList();
    }

    public ItemResponse createItem(CreateItemRequest request) {
        User me = currentUserService.get();

        Item item = Item.builder()
                .owner(me)
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .available(true)
                .build();

        return toDto(itemRepository.save(item));
    }

    public List<ItemResponse> getMyItems() {
        User me = currentUserService.get();
        return itemRepository.findByOwnerId(me.getId()).stream().map(this::toDto).toList();
    }

    public void deleteItem(Long itemId) {
        User me = currentUserService.get();
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (!item.getOwner().getId().equals(me.getId())) {
            throw new BadRequestException("You can only remove items you own");
        }

        boolean hasActiveLoan = !loanRequestRepository.findByItemOwnerIdOrderByCreatedAtDesc(me.getId()).stream()
                .filter(l -> l.getItem().getId().equals(itemId))
                .filter(l -> l.getStatus() == LoanStatus.BORROWED || l.getStatus() == LoanStatus.OVERDUE)
                .toList().isEmpty();

        if (hasActiveLoan) {
            throw new BadRequestException("Cannot remove an item that is currently on loan");
        }

        itemRepository.delete(item);
    }

    private ItemResponse toDto(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .category(item.getCategory())
                .available(item.isAvailable())
                .ownerId(item.getOwner().getId())
                .ownerName(item.getOwner().getName())
                .ownerNeighborhood(item.getOwner().getNeighborhood())
                .build();
    }
}
