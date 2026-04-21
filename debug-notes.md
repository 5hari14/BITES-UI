# Dish Catalog Debug Notes

## Issue
When pressing "+ More" on the log screen, the DishCatalogModal opens but:
- Header shows correctly: "Dish Catalog" with X and Done buttons
- Search bar shows correctly
- Content area is BLACK/EMPTY - no categories or dishes visible
- There appears to be a blue loading spinner in the center
- The markdown extraction shows the content IS there (categories, dishes) but it's not visible

## Likely Cause
The content area's scrollable div is probably not getting proper height, or the text colors are not contrasting against the background. The `overflow-y-auto` div might have zero height, or the content is rendering behind something.

## Key observation
The markdown extraction shows: "Starter 5, Main 13, Dessert 3, Drink 4, All Dishes (183)" and individual dishes - so the data IS loading. The issue is purely visual - the content is there but not visible.

## Possible fixes
1. The scrollable content div might need explicit height or flex-1 isn't working
2. The category accordion buttons and dish rows might have invisible text (color issue)
3. The `absolute inset-0` positioning might not work correctly inside the phone shell
