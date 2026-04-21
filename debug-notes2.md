# Dish Catalog Fix Progress

## Current State
The dish catalog now shows dishes! The content is visible with:
- Category accordions (Starter, Main, Dessert, Drink) 
- All Dishes list with emoji, name, category
- Plus/check buttons for selection

## Remaining Issue
The header (X button, "Dish Catalog" title, search bar, Done button) is scrolled OUT OF VIEW.
The phone shell's scroll container is scrolling the entire modal content, so the header scrolls away.

## Root Cause
The DishCatalogModal is rendered inside the PhoneShell's scrollable div. The modal's header and search bar are part of the flex column but the parent scroll container scrolls everything.

## Fix Needed
The modal needs to be rendered as a full-screen overlay INSIDE the phone frame, not inside the scroll container. Options:
1. Make the modal use `position: fixed` within the phone frame
2. Render the modal at the PhoneShell level instead of inside the scroll container
3. Use a portal-like approach to render outside the scroll div
