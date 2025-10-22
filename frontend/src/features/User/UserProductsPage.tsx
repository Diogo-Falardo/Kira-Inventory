import * as React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Package, MoreHorizontal, Pencil, Power, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

/* ----------------------------- mock products ----------------------------- */
type Product = {
  id: number;
  name: string;
  internal_code: string;
  price: number;
  cost: number;
  available_stock: number;
  updated_at?: string;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: 7,
    name: "product4",
    internal_code: "string6",
    price: 105,
    cost: 20,
    available_stock: 13,
    updated_at: "2025-10-17T15:49:31",
  },
  {
    id: 6,
    name: "product3",
    internal_code: "string5",
    price: 45,
    cost: 15,
    available_stock: 100,
    updated_at: "2025-10-17T15:49:22",
  },
  {
    id: 5,
    name: "product2",
    internal_code: "string4",
    price: 25,
    cost: 5,
    available_stock: 25,
    updated_at: "2025-10-17T15:49:18",
  },
  {
    id: 4,
    name: "product1",
    internal_code: "string3",
    price: 10,
    cost: 20,
    available_stock: 10,
    updated_at: "2025-10-17T15:49:13",
  },
  {
    id: 1,
    name: "string",
    internal_code: "string",
    price: 1,
    cost: 1,
    available_stock: 2,
    updated_at: "2025-10-15T16:54:02",
  },
];

/* ----------------------------- banner helper ----------------------------- */
function useBanner() {
  const [banner, setBanner] = React.useState<
    | {
        type: "ok" | "error";
        msg: string;
      }
    | undefined
  >();
  const ok = (msg: string) => setBanner({ type: "ok", msg });
  const err = (msg: string) => setBanner({ type: "error", msg });
  return { banner, ok, err, clear: () => setBanner(undefined) };
}

/* ----------------------------- page component ---------------------------- */
export default function UserProductsPage() {
  const { banner, ok } = useBanner();

  // table controls (pure UI)
  const [mode, setMode] = React.useState<"all" | "first" | "last">("all");
  const [n, setN] = React.useState(5);
  const products = React.useMemo(() => {
    if (mode === "all") return MOCK_PRODUCTS;
    if (mode === "first") return MOCK_PRODUCTS.slice(0, n);
    // last
    return MOCK_PRODUCTS.slice(-n);
  }, [mode, n]);

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {banner && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              banner.type === "ok"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {banner.msg}
          </div>
        )}

        {/* --------------------------- TABLE (UI-only) --------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col gap-3 p-4 border-b border-slate-200 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-slate-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      My Products
                    </h3>
                    <p className="text-sm text-slate-600">
                      Showing{" "}
                      <span className="font-medium">{products.length}</span>{" "}
                      items
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-xs font-medium text-slate-600">
                    Order
                  </label>
                  <select
                    className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    value={mode}
                    onChange={(e) =>
                      setMode(e.target.value as "all" | "first" | "last")
                    }
                  >
                    <option value="all">all</option>
                    <option value="first">first</option>
                    <option value="last">last</option>
                  </select>

                  <label className="text-xs font-medium text-slate-600">
                    Count (n)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={n}
                    onChange={(e) => setN(Math.max(1, Number(e.target.value)))}
                    className="h-9 w-24 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                  />

                  <Button
                    variant="outline"
                    className="border-slate-200"
                    onClick={() => ok("Refreshed (UI only).")}
                  >
                    <MoreHorizontal className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50/80 text-slate-600">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">ID</th>
                      <th className="text-left font-medium px-4 py-3">
                        Product
                      </th>
                      <th className="text-left font-medium px-4 py-3">SKU</th>
                      <th className="text-left font-medium px-4 py-3">Price</th>
                      <th className="text-left font-medium px-4 py-3">Cost</th>
                      <th className="text-left font-medium px-4 py-3">Stock</th>
                      <th className="text-left font-medium px-4 py-3">
                        Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 text-slate-500">{p.id}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {p.name}
                        </td>
                        <td className="px-4 py-3">{p.internal_code}</td>
                        <td className="px-4 py-3">{p.price}</td>
                        <td className="px-4 py-3">{p.cost}</td>
                        <td className="px-4 py-3">{p.available_stock}</td>
                        <td className="px-4 py-3">
                          {p.updated_at
                            ? new Date(p.updated_at).toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-6 text-center text-slate-500"
                        >
                          No products (UI-only).
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* --------------------------- FORMS GRID (UI-only) --------------------------- */}
        <section className="grid gap-6 lg:grid-cols-2">
          <AddProductCard onSubmitted={(v) => console.log("Add (UI):", v)} />
          <UpdateProductCard
            onSubmitted={(v) => console.log("Update (UI):", v)}
          />
          <InactivateCard
            onSubmitted={(v) => console.log("Inactivate (UI):", v)}
          />
          <DeleteCard onSubmitted={(v) => console.log("Delete (UI):", v)} />
        </section>
      </main>
    </div>
  );
}

/* ============================== Form Cards ============================== */

/* ADD PRODUCT */
type AddValues = {
  name: string;
  internal_code?: string;
  price?: number | string;
  cost?: number | string;
  available_stock?: number | string;
  platform?: string;
  img_url?: string;
  description?: string;
};
function AddProductCard({
  onSubmitted,
}: {
  onSubmitted: (v: AddValues) => void;
}) {
  const form = useForm<AddValues>({
    defaultValues: {
      name: "",
      internal_code: "",
      price: "",
      cost: "",
      available_stock: "",
      platform: "",
      img_url: "",
      description: "",
    },
  });

  const onSubmit = (values: AddValues) => {
    onSubmitted(values);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-slate-200">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold">Add Product</h2>
          </div>

          <Form {...form}>
            <form
              className="grid gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="internal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="SKU / internal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="available_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <FormControl>
                        <Input placeholder="Shopify, Etsy…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="img_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        className="min-h-[90px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                        placeholder="Optional description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button
                  size="lg"
                  className="bg-slate-600 hover:bg-slate-700"
                  type="submit"
                >
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* UPDATE PRODUCT */
type UpdateValues = {
  product_id: number | string;
  name?: string;
  internal_code?: string;
  price?: number | string;
  cost?: number | string;
  available_stock?: number | string;
  platform?: string;
  img_url?: string;
  description?: string;
};
function UpdateProductCard({
  onSubmitted,
}: {
  onSubmitted: (v: UpdateValues) => void;
}) {
  const form = useForm<UpdateValues>({
    defaultValues: {
      product_id: "",
      name: "",
      internal_code: "",
      price: "",
      cost: "",
      available_stock: "",
      platform: "",
      img_url: "",
      description: "",
    },
  });

  const onSubmit = (values: UpdateValues) => {
    onSubmitted(values);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-slate-200">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold">Update Product</h2>
          </div>

          <Form {...form}>
            <form
              className="grid gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="product_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          placeholder="ID"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="(optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="internal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="(optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="(optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="(optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="available_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          placeholder="(optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <FormControl>
                        <Input placeholder="(optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="img_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="(optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        className="min-h-[90px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                        placeholder="(optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button
                  size="lg"
                  className="bg-slate-600 hover:bg-slate-700"
                  type="submit"
                >
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* INACTIVATE PRODUCT */
type InactivateValues = { product_id: number | string };
function InactivateCard({
  onSubmitted,
}: {
  onSubmitted: (v: InactivateValues) => void;
}) {
  const form = useForm<InactivateValues>({ defaultValues: { product_id: "" } });
  const onSubmit = (v: InactivateValues) => onSubmitted(v);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-slate-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Power className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold">Inactivate Product</h2>
          </div>

          <Form {...form}>
            <form
              className="grid gap-3"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product ID</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        placeholder="ID"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="bg-amber-600 hover:bg-amber-700" type="submit">
                Inactivate
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* DELETE PRODUCT */
type DeleteValues = { product_id: number | string };
function DeleteCard({
  onSubmitted,
}: {
  onSubmitted: (v: DeleteValues) => void;
}) {
  const form = useForm<DeleteValues>({ defaultValues: { product_id: "" } });
  const onSubmit = (v: DeleteValues) => onSubmitted(v);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-slate-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold">Delete Product</h2>
          </div>

          <Form {...form}>
            <form
              className="grid gap-3"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product ID</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        placeholder="ID"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="bg-red-600 hover:bg-red-700" type="submit">
                Delete
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
