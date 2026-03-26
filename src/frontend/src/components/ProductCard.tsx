import { Badge } from "@/components/ui/badge";
import { ExternalLink, Heart, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "../backend.d";

interface ProductCardProps {
  product: Product;
  index: number;
}

function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  const amazonCheaper = product.amazonPrice < product.flipkartPrice;
  const flipkartCheaper = product.flipkartPrice < product.amazonPrice;
  const saving = Math.abs(product.amazonPrice - product.flipkartPrice);
  const savingPct = Math.round(
    (saving / Math.max(product.amazonPrice, product.flipkartPrice)) * 100,
  );

  return (
    <div
      className="bg-card rounded-xl border border-border shadow-card overflow-hidden flex flex-col hover:shadow-md transition-shadow"
      data-ocid={`products.item.${index}`}
    >
      {/* Image */}
      <div className="relative bg-muted h-48 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x400/EEF2FF/3B82F6?text=Product";
          }}
        />
        {/* Wishlist */}
        <button
          type="button"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center hover:scale-110 transition-transform"
          onClick={() => setWishlisted((v) => !v)}
          data-ocid={`products.wishlist.toggle.${index}`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
          />
        </button>
        {/* Best deal badge */}
        {saving > 0 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-success-badge text-xs font-semibold px-2 py-0.5 rounded-full">
              Save {savingPct}%
            </Badge>
          </div>
        )}
        {/* Category */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 text-xs font-medium px-2 py-0.5 rounded-full text-muted-foreground">
            {product.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Rating placeholder */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
            />
          ))}
          <Star className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground ml-1">
            (4.0) · 2.3k reviews
          </span>
        </div>

        {/* Prices */}
        <div className="space-y-2 mt-auto">
          {/* Amazon */}
          <a
            href={product.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition-opacity hover:opacity-90 amazon-btn text-sm font-medium"
            data-ocid={`products.amazon_button.${index}`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs opacity-80">Amazon</span>
              {amazonCheaper && (
                <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                  BEST DEAL
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold">
                {formatPrice(product.amazonPrice)}
              </span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </div>
          </a>

          {/* Flipkart */}
          <a
            href={product.flipkartLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg transition-opacity hover:opacity-90 flipkart-btn text-sm font-medium"
            data-ocid={`products.flipkart_button.${index}`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs opacity-80">Flipkart</span>
              {flipkartCheaper && (
                <span className="text-[10px] bg-green-400 text-white px-1.5 py-0.5 rounded-full font-bold">
                  BEST DEAL
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold">
                {formatPrice(product.flipkartPrice)}
              </span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
