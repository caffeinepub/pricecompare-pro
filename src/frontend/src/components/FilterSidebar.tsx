import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Appliances",
  "Home",
  "Laptops",
];

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  showAmazon: boolean;
  showFlipkart: boolean;
  onRetailerChange: (retailer: "amazon" | "flipkart", val: boolean) => void;
}

export default function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  showAmazon,
  showFlipkart,
  onRetailerChange,
}: FilterSidebarProps) {
  return (
    <aside className="w-56 shrink-0 space-y-6" data-ocid="filter.panel">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-3">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                selectedCategory === cat
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => onCategoryChange(cat)}
              data-ocid={`filter.category.${cat.toLowerCase()}.button`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price range */}
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-3">
          Price Range
        </h3>
        <Slider
          min={0}
          max={200000}
          step={1000}
          value={[priceRange[1]]}
          onValueChange={([val]) => onPriceRangeChange([0, val])}
          className="mb-2"
          data-ocid="filter.price.select"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₹0</span>
          <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
        </div>
      </div>

      <Separator />

      {/* Retailer */}
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-3">Retailer</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="amazon"
              checked={showAmazon}
              onCheckedChange={(v) => onRetailerChange("amazon", !!v)}
              data-ocid="filter.amazon.checkbox"
            />
            <Label htmlFor="amazon" className="text-sm cursor-pointer">
              Amazon
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="flipkart"
              checked={showFlipkart}
              onCheckedChange={(v) => onRetailerChange("flipkart", !!v)}
              data-ocid="filter.flipkart.checkbox"
            />
            <Label htmlFor="flipkart" className="text-sm cursor-pointer">
              Flipkart
            </Label>
          </div>
        </div>
      </div>
    </aside>
  );
}
