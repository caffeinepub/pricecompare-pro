import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  LayoutDashboard,
  Link2,
  Loader2,
  LogOut,
  PackageOpen,
  Pencil,
  PlusCircle,
  Settings,
  Tag,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product, ProductInput } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateProduct,
  useDeleteProduct,
  useGetAllProducts,
  useIsAdmin,
  useUpdateProduct,
} from "../hooks/useQueries";

type AdminSection =
  | "dashboard"
  | "products"
  | "add"
  | "categories"
  | "affiliates"
  | "settings";

const NAV_ITEMS: {
  id: AdminSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Manage Products", icon: PackageOpen },
  { id: "add", label: "Add New Product", icon: PlusCircle },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "affiliates", label: "Affiliate Links", icon: Link2 },
  { id: "settings", label: "Settings", icon: Settings },
];

const EMPTY_FORM: ProductInput = {
  name: "",
  description: "",
  imageUrl: "",
  category: "",
  amazonPrice: 0,
  amazonLink: "",
  flipkartPrice: 0,
  flipkartLink: "",
};

function formatPrice(n: number) {
  return `\u20b9${n.toLocaleString("en-IN")}`;
}

export default function AdminPage() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const [section, setSection] = useState<AdminSection>("dashboard");
  const [formData, setFormData] = useState<ProductInput>(EMPTY_FORM);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: products = [], isLoading: productsLoading } =
    useGetAllProducts();
  const { data: isAdmin } = useIsAdmin();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct.mutateAsync(formData);
      toast.success("Product added successfully!");
      setFormData(EMPTY_FORM);
      setSection("products");
    } catch {
      toast.error("Failed to add product. Admin access required.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        input: formData,
      });
      toast.success("Product updated!");
      setEditDialogOpen(false);
      setEditingProduct(null);
    } catch {
      toast.error("Failed to update product.");
    }
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    try {
      await deleteProduct.mutateAsync(deletingId);
      toast.success("Product deleted.");
      setDeletingId(null);
    } catch {
      toast.error("Failed to delete product.");
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      amazonPrice: product.amazonPrice,
      amazonLink: product.amazonLink,
      flipkartPrice: product.flipkartPrice,
      flipkartLink: product.flipkartLink,
    });
    setEditDialogOpen(true);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl border border-border shadow-card p-8 w-full max-w-md text-center"
          data-ocid="admin.login.panel"
        >
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            PC
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Admin Portal
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Sign in with Internet Identity to manage products and affiliate
            links.
          </p>
          <Button
            className="w-full h-11"
            onClick={() => login()}
            disabled={isLoggingIn}
            data-ocid="admin.login.button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                in\u2026
              </>
            ) : (
              "Sign in with Internet Identity"
            )}
          </Button>
          <Link
            to="/"
            className="block mt-4 text-sm text-muted-foreground hover:text-foreground"
          >
            \u2190 Back to store
          </Link>
        </motion.div>
      </div>
    );
  }

  // Access denied
  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center" data-ocid="admin.access_denied.panel">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You don&apos;t have admin privileges.
          </p>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col shrink-0"
        style={{ backgroundColor: "oklch(var(--admin-sidebar))" }}
        data-ocid="admin.sidebar.panel"
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
              PC
            </div>
            <span className="font-bold text-white">PriceCompare</span>
          </div>
          <p className="text-xs text-white/50 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  section === item.id
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setSection(item.id)}
                data-ocid={`admin.${item.id}.link`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors mb-1"
            data-ocid="admin.back.link"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Store
          </Link>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors w-full"
            onClick={handleLogout}
            data-ocid="admin.logout.button"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        {section === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              {[
                {
                  label: "Total Products",
                  value: products.length,
                  color: "text-primary",
                },
                {
                  label: "Amazon Listings",
                  value: products.length,
                  color: "text-black",
                },
                {
                  label: "Flipkart Listings",
                  value: products.length,
                  color: "text-blue-600",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card border border-border rounded-xl p-5 shadow-xs"
                >
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              Use the sidebar to manage products, add new listings, and
              configure affiliate links.
            </p>
          </motion.div>
        )}

        {section === "products" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Manage Products</h1>
              <Button
                size="sm"
                onClick={() => setSection("add")}
                data-ocid="admin.add_product.button"
              >
                <PlusCircle className="w-4 h-4 mr-1" /> Add Product
              </Button>
            </div>

            {productsLoading ? (
              <div
                className="flex items-center gap-2 text-muted-foreground"
                data-ocid="admin.products.loading_state"
              >
                <Loader2 className="w-4 h-4 animate-spin" /> Loading
                products\u2026
              </div>
            ) : products.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="admin.products.empty_state"
              >
                <PackageOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No products yet. Add your first product!</p>
              </div>
            ) : (
              <div
                className="border border-border rounded-xl overflow-hidden"
                data-ocid="admin.products.table"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amazon</TableHead>
                      <TableHead>Flipkart</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, i) => (
                      <TableRow
                        key={String(product.id)}
                        data-ocid={`admin.product.row.${i + 1}`}
                      >
                        <TableCell className="font-medium max-w-48">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover bg-muted"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                            <span className="line-clamp-2 text-sm">
                              {product.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-semibold">
                          {formatPrice(product.amazonPrice)}
                        </TableCell>
                        <TableCell className="text-sm font-semibold">
                          {formatPrice(product.flipkartPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(product)}
                              data-ocid={`admin.product.edit_button.${i + 1}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeletingId(product.id)}
                              data-ocid={`admin.product.delete_button.${i + 1}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>
        )}

        {section === "add" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold mb-6">Upload New Product</h1>
            <form
              onSubmit={handleSubmit}
              className="max-w-2xl bg-card border border-border rounded-xl p-6 space-y-5"
              data-ocid="admin.add_product.panel"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Samsung Galaxy S24"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid="admin.product_name.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    placeholder="e.g. Electronics"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, category: e.target.value }))
                    }
                    data-ocid="admin.product_category.input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief product description\u2026"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  data-ocid="admin.product_description.textarea"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="imageUrl">Product Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/product.jpg"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, imageUrl: e.target.value }))
                  }
                  data-ocid="admin.product_image.input"
                />
              </div>

              {/* Amazon fields */}
              <div className="border border-border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-800 inline-block" />
                  Amazon Listing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="amazonPrice">Amazon Price (\u20b9) *</Label>
                    <Input
                      id="amazonPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      placeholder="79999"
                      value={formData.amazonPrice || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          amazonPrice: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                      data-ocid="admin.amazon_price.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="amazonLink">Amazon Affiliate Link *</Label>
                    <Input
                      id="amazonLink"
                      type="url"
                      placeholder="https://amazon.in/\u2026"
                      required
                      value={formData.amazonLink}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          amazonLink: e.target.value,
                        }))
                      }
                      data-ocid="admin.amazon_link.input"
                    />
                  </div>
                </div>
              </div>

              {/* Flipkart fields */}
              <div className="border border-border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                  Flipkart Listing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="flipkartPrice">
                      Flipkart Price (\u20b9) *
                    </Label>
                    <Input
                      id="flipkartPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      placeholder="77499"
                      value={formData.flipkartPrice || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          flipkartPrice: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                      data-ocid="admin.flipkart_price.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="flipkartLink">
                      Flipkart Affiliate Link *
                    </Label>
                    <Input
                      id="flipkartLink"
                      type="url"
                      placeholder="https://flipkart.com/\u2026"
                      required
                      value={formData.flipkartLink}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          flipkartLink: e.target.value,
                        }))
                      }
                      data-ocid="admin.flipkart_link.input"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={createProduct.isPending}
                  data-ocid="admin.add_product.submit_button"
                >
                  {createProduct.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving\u2026
                    </>
                  ) : (
                    "Save Product"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData(EMPTY_FORM);
                    setSection("products");
                  }}
                  data-ocid="admin.add_product.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {section === "categories" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold mb-6">Categories</h1>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(products.map((p) => p.category))).map(
                (cat) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="text-sm px-4 py-1.5"
                  >
                    {cat}
                  </Badge>
                ),
              )}
              {products.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No categories yet.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {section === "affiliates" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold mb-6">Affiliate Links</h1>
            <div className="space-y-3">
              {products.map((p, i) => (
                <div
                  key={String(p.id)}
                  className="border border-border rounded-lg p-4 text-sm"
                  data-ocid={`admin.affiliate.item.${i + 1}`}
                >
                  <p className="font-semibold mb-2">{p.name}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={p.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary truncate hover:underline"
                    >
                      Amazon: {p.amazonLink}
                    </a>
                    <a
                      href={p.flipkartLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 truncate hover:underline"
                    >
                      Flipkart: {p.flipkartLink}
                    </a>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No affiliate links yet.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {section === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <div className="bg-card border border-border rounded-xl p-6 max-w-md space-y-4">
              <div>
                <p className="text-sm font-medium">Logged in as</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
                  {identity?.getPrincipal().toString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                data-ocid="admin.settings.logout.button"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.edit_product.dialog"
        >
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Product Name</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                data-ocid="admin.edit_product_name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, category: e.target.value }))
                }
                data-ocid="admin.edit_product_category.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                data-ocid="admin.edit_product_description.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, imageUrl: e.target.value }))
                }
                data-ocid="admin.edit_product_image.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Amazon Price (\u20b9)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.amazonPrice || ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      amazonPrice: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  data-ocid="admin.edit_amazon_price.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Flipkart Price (\u20b9)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.flipkartPrice || ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      flipkartPrice: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  data-ocid="admin.edit_flipkart_price.input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Amazon Link</Label>
              <Input
                type="url"
                required
                value={formData.amazonLink}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, amazonLink: e.target.value }))
                }
                data-ocid="admin.edit_amazon_link.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Flipkart Link</Label>
              <Input
                type="url"
                required
                value={formData.flipkartLink}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, flipkartLink: e.target.value }))
                }
                data-ocid="admin.edit_flipkart_link.input"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                data-ocid="admin.edit_product.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProduct.isPending}
                data-ocid="admin.edit_product.save_button"
              >
                {updateProduct.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
      >
        <AlertDialogContent data-ocid="admin.delete_product.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product and its affiliate links
              will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.delete_product.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin.delete_product.confirm_button"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
