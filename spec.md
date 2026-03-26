# PriceCompare Pro

## Current State
New project, no existing application files.

## Requested Changes (Diff)

### Add
- Public product listing page showing products with prices from Amazon and Flipkart side by side
- Each product card shows product name, image, description, Amazon price + affiliate link, Flipkart price + affiliate link
- Admin panel (password protected) to add/edit/remove products
- Admin form: product name, description, image URL, Amazon price, Amazon affiliate link, Flipkart price, Flipkart affiliate link
- "Best deal" badge on the cheaper platform
- Click-through affiliate links open in new tab
- Search/filter products by name
- Category tagging for products

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Store products with name, description, imageUrl, category, amazonPrice, amazonLink, flipkartPrice, flipkartLink
2. Backend: CRUD operations for products, admin-protected mutations
3. Frontend: Public homepage with product grid, search, filter by category
4. Frontend: Product card with side-by-side price comparison, best deal badge, affiliate links
5. Frontend: Admin panel with login and product management form
