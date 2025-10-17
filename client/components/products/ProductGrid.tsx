import ProductCard from "@/components/products/ProductCard";
import { products, brands } from "@/data/products";
import { useMemo, useState } from "react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProductGrid() {
  const [active, setActive] = useState<string>("All");
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase().trim();

  const filtered = useMemo(() => {
    let base =
      active === "All" ? products : products.filter((p) => p.brand === active);
    if (q) base = base.filter((p) => p.name.toLowerCase().includes(q));

    if (active !== "All" || base.length < 4 || q) return base;

    const fallbackLastFour = [
      "https://images.pexels.com/photos/20298291/pexels-photo-20298291.png?auto=compress&cs=tinysrgb&w=1200&h=1200&dpr=1",
      "https://images.pexels.com/photos/20298292/pexels-photo-20298292.png?auto=compress&cs=tinysrgb&w=1200&h=1200&dpr=1",
      "https://images.pexels.com/photos/27113455/pexels-photo-27113455.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1200&dpr=1",
      "https://images.pexels.com/photos/2404959/pexels-photo-2404959.png?auto=compress&cs=tinysrgb&w=1200&h=1200&dpr=1",
    ];
    const start = base.length - 4;
    return base.map((p, idx) =>
      idx >= start
        ? { ...p, image: fallbackLastFour[idx - start] }
        : p
    );
  }, [active, q]);

  const handleAddToCart = async (prod: any) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/profile"); // redirect to login/signup
      return;
    }

    // 1️⃣ Update local/global cart (UI updates instantly)
    addToCart({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      brand: prod.brand,
    });

    // 2️⃣ Send to backend (MongoDB)
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${user._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          image: prod.image,
          brand: prod.brand,
          qty: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to save cart in DB");

      toast.success(`${prod.name} added to your cart!`);
    } catch (err) {
      console.error(err);
      toast.error("Could not save cart in DB. Try again.");
    }
  };

  return (
    <section id="featured" className="container mx-auto px-4 py-12 sm:py-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Featured
          </p>
          <h2 className="heading-display mt-2 text-2xl font-semibold sm:text-3xl">
            Latest Drops
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setActive(b)}
              className={`h-9 rounded-md border px-3 text-sm font-medium transition-colors ${
                active === b
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-muted"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
      {q && (
        <p className="mb-4 text-sm text-muted-foreground">
          Showing results for "{q}"
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered
          .filter((p) => !!p.image)
          .map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
      </div>
    </section>
  );
}
