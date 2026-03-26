import type { Product } from "../backend.d";

export const SEED_PRODUCTS: Product[] = [
  {
    id: 1n,
    name: "Apple iPhone 15 (128GB, Black)",
    description:
      "The latest iPhone 15 with A16 Bionic chip, 48MP camera, USB-C, and Dynamic Island. The ultimate smartphone experience.",
    imageUrl: "/assets/generated/iphone15.dim_400x400.jpg",
    category: "Electronics",
    amazonPrice: 79999,
    amazonLink:
      "https://www.amazon.in/Apple-iPhone-15-128GB-Black/dp/B0CHX1W1XY",
    flipkartPrice: 77499,
    flipkartLink: "https://www.flipkart.com/apple-iphone-15/p/itm6ac5891bec663",
    createdAt: BigInt(Date.now()),
  },
  {
    id: 2n,
    name: 'Samsung 65" 4K QLED Smart TV',
    description:
      "Experience stunning 4K QLED visuals with Samsung's Quantum Processor. Smart TV with built-in Alexa and Google Assistant.",
    imageUrl: "/assets/generated/samsung-tv.dim_400x400.jpg",
    category: "Electronics",
    amazonPrice: 89990,
    amazonLink:
      "https://www.amazon.in/Samsung-65-Inch-QLED-Smart/dp/B0BSHF7WHB",
    flipkartPrice: 85000,
    flipkartLink:
      "https://www.flipkart.com/samsung-164-cm-65-inch-qled-ultra-hd-4k-smart-tizen-tv/p/itmf9f3c88b7a13e",
    createdAt: BigInt(Date.now()),
  },
  {
    id: 3n,
    name: "Levi's 511 Slim Fit Jeans",
    description:
      "Classic Levi's 511 slim fit jeans in indigo blue. Made from stretch denim for all-day comfort and iconic style.",
    imageUrl: "/assets/generated/levis-jeans.dim_400x400.jpg",
    category: "Fashion",
    amazonPrice: 2499,
    amazonLink: "https://www.amazon.in/Levis-Mens-511-Jeans/dp/B07PHGTXQM",
    flipkartPrice: 2199,
    flipkartLink:
      "https://www.flipkart.com/levi-s-slim-men-blue-jeans/p/itm5d9e6d4b89def",
    createdAt: BigInt(Date.now()),
  },
  {
    id: 4n,
    name: "Instant Pot Duo 7-in-1 Electric Cooker",
    description:
      "7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer.",
    imageUrl: "/assets/generated/instant-pot.dim_400x400.jpg",
    category: "Appliances",
    amazonPrice: 8999,
    amazonLink:
      "https://www.amazon.in/Instant-Pot-DUO60-Electric/dp/B01NBKTPTS",
    flipkartPrice: 9499,
    flipkartLink:
      "https://www.flipkart.com/instant-pot-duo60-1200-w-induction-bottom-electric-rice-cooker/p/itmf9ab3462b98b0",
    createdAt: BigInt(Date.now()),
  },
  {
    id: 5n,
    name: "Apple MacBook Air M2 (13-inch, 8GB RAM)",
    description:
      "Supercharged by M2 chip with 8-core CPU, 10-core GPU, and 18-hour battery. Thin, light, and blazing fast.",
    imageUrl: "/assets/generated/macbook-air.dim_400x400.jpg",
    category: "Laptops",
    amazonPrice: 114990,
    amazonLink:
      "https://www.amazon.in/Apple-MacBook-Laptop-8-Core-storage/dp/B0B3C5PQMS",
    flipkartPrice: 109900,
    flipkartLink:
      "https://www.flipkart.com/apple-macbook-air-m2-8-gb-256-gb-ssd/p/itm7ea8aced71d8c",
    createdAt: BigInt(Date.now()),
  },
  {
    id: 6n,
    name: "Dyson V15 Detect Absolute Vacuum",
    description:
      "Laser Slim Fluffy cleaner head reveals microscopic dust. Built-in LCD screen shows real-time scientific proof of capture.",
    imageUrl: "/assets/generated/dyson-v15.dim_400x400.jpg",
    category: "Home",
    amazonPrice: 52900,
    amazonLink:
      "https://www.amazon.in/Dyson-V15-Detect-Absolute-Cordless/dp/B08XY8Z8SN",
    flipkartPrice: 54999,
    flipkartLink:
      "https://www.flipkart.com/dyson-v15-detect-absolute-cordless-vacuum-cleaner/p/itm4a9a82b5f3ef0",
    createdAt: BigInt(Date.now()),
  },
];
