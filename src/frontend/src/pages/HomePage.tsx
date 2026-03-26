import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Home,
  Laptop,
  Refrigerator,
  Search,
  Shirt,
  Tv,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Product } from "../backend.d";
import FilterSidebar from "../components/FilterSidebar";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { SEED_PRODUCTS } from "../data/seedProducts";
import { useListProducts, useSearchProducts } from "../hooks/useQueries";

const CATEGORIES = [
  { label: "Electronics", icon: Zap, color: "bg-blue-50 text-blue-600" },
  { label: "Fashion", icon: Shirt, color: "bg-pink-50 text-pink-600" },
  {
    label: "Appliances",
    icon: Refrigerator,
    color: "bg-orange-50 text-orange-600",
  },
  { label: "Home", icon: Home, color: "bg-green-50 text-green-600" },
  { label: "Laptops", icon: Laptop, color: "bg-purple-50 text-purple-600" },
  { label: "TV", icon: Tv, color: "bg-yellow-50 text-yellow-600" },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [heroSearch, setHeroSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [showAmazon, setShowAmazon] = useState(true);
  const [showFlipkart, setShowFlipkart] = useState(true);

  const { data: backendProducts } = useListProducts(
    selectedCategory !== "All" ? selectedCategory : undefined,
  );

  const activeSearch = searchQuery || heroSearch;
  const { data: searchResults } = useSearchProducts(activeSearch);

  const products: Product[] = useMemo(() => {
    const source =
      backendProducts && backendProducts.length > 0
        ? backendProducts
        : SEED_PRODUCTS;

    let list = activeSearch
      ? searchResults && searchResults.length > 0
        ? searchResults
        : source.filter(
            (p) =>
              p.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
              p.category.toLowerCase().includes(activeSearch.toLowerCase()),
          )
      : source;

    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    list = list.filter((p) => {
      const minPrice = Math.min(p.amazonPrice, p.flipkartPrice);
      return minPrice <= priceRange[1];
    });

    return list;
  }, [
    backendProducts,
    searchResults,
    activeSearch,
    selectedCategory,
    priceRange,
  ]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(heroSearch);
  };

  // suppress unused warning — retailer filters could be used for UI-only display logic
  void showAmazon;
  void showFlipkart;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero */}
      <section
        className="py-16 px-4 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--hero-bg)), oklch(var(--hero-bg-to)))",
        }}
        data-ocid="hero.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
            \ud83c\uddee\ud83c\uddf3 Best Prices in India
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            Compare Amazon &amp; Flipkart
            <span className="text-primary block mt-1">Prices Instantly.</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Find the best deal on your favorite products. We compare prices from
            Amazon and Flipkart so you save more every time.
          </p>

          {/* Hero search bar */}
          <form
            onSubmit={handleHeroSearch}
            className="flex gap-2 max-w-lg mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for iPhone, Samsung TV, Nike shoes\u2026"
                className="pl-12 h-12 rounded-full text-base shadow-sm bg-white border-border"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                data-ocid="hero.search_input"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-6 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
              data-ocid="hero.search.button"
            >
              Search
            </button>
          </form>
        </motion.div>

        {/* Category tiles */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mt-10"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                type="button"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-xs transition-all hover:scale-105 hover:shadow-sm bg-white border border-border ${
                  selectedCategory === cat.label ? "ring-2 ring-primary" : ""
                }`}
                onClick={() =>
                  setSelectedCategory(
                    cat.label === selectedCategory ? "All" : cat.label,
                  )
                }
                data-ocid={`hero.${cat.label.toLowerCase()}.tab`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </motion.div>
      </section>

      {/* Main content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            showAmazon={showAmazon}
            showFlipkart={showFlipkart}
            onRetailerChange={(r, v) => {
              if (r === "amazon") setShowAmazon(v);
              else setShowFlipkart(v);
            }}
          />

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Today&apos;s Best Price Comparisons
              </h2>
              <span className="text-sm text-muted-foreground">
                {products.length} products
              </span>
            </div>

            {products.length === 0 ? (
              <div
                className="text-center py-20 text-muted-foreground"
                data-ocid="products.empty_state"
              >
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
              >
                {products.map((product, i) => (
                  <motion.div
                    key={String(product.id)}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} index={i + 1} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">
              About
            </a>
            <a href="/" className="hover:text-foreground transition-colors">
              Contact
            </a>
            <a href="/" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="/" className="hover:text-foreground transition-colors">
              Privacy
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()}. Built with \u2764\ufe0f using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
