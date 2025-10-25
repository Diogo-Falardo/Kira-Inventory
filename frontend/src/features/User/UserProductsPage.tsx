import { useEffect, useMemo, useState } from "react";
// page
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Package, Pencil, Power, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

// alert
import { toast } from "react-toastify";

// api
// react query
import { useQueryClient } from "@tanstack/react-query";
// api helper for nice error messages
import { getApiErrorMessage } from "@/core/api";
// generated API hooks from Orval
import {
  useMyProductsProductMyProductsGet,
  useAddProductProductAddProductPost,
  useUpdateProductProductUpdateProductProductIdPatch,
  useInactiveProductProductInactiveProductProductIdPut,
  useDeleteProductProductDeleteProductProductIdDelete,
} from "@/generated/product/product";

// types
import type { Product } from "@/lib/OtherTypes";
import type { ProductCreate, ProductUpdate } from "@/generated/orval.schemas";

// Entire page
export default function UserProductsPage() {
  // UI state that controls which products we request
  const [mode, setMode] = useState<"all" | "first" | "last">("all");
  const [n, setN] = useState(5);

  // Build query params for the GET hook.
  // If mode === "all", we don't send any params.
  // Otherwise we send { mode, n }.
  const queryTableParams = useMemo(() => {
    if (mode === "all") return undefined;
    return { mode, n };
  }, [mode, n]);

  const {
    data,
    isLoading,
    isError,
    error: fetchError,
  } = useMyProductsProductMyProductsGet<Product[]>(queryTableParams);

  useEffect(() => {
    if (isError) {
      toast.error("Something happened while fetching products.");
      console.error(fetchError);
    }
  }, [isError, fetchError]);

  const products = data ?? [];

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/*PRODUCTS TABLE CARD */}
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
                      <span className="font-medium">
                        {isLoading ? "…" : products.length}
                      </span>{" "}
                      items
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-600 font-medium">
                      Order
                    </span>
                    <Select
                      value={mode}
                      onValueChange={(val: "all" | "first" | "last") =>
                        setMode(val)
                      }
                    >
                      <SelectTrigger className="h-9 w-[110px] rounded-xl border border-slate-200 bg-white text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="text-sm">
                        <SelectItem value="all">all</SelectItem>
                        <SelectItem value="first">first</SelectItem>
                        <SelectItem value="last">last</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-slate-600 font-medium">
                      Count
                    </span>
                    <Input
                      type="number"
                      min={1}
                      max={1000}
                      value={n}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        setN(Math.max(1, next));
                      }}
                      className="h-9 w-24 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[75%]" />
                    <Skeleton className="h-4 w-[82%]" />
                    <Skeleton className="h-4 w-[60%]" />
                  </div>
                ) : (
                  <Table className="text-sm">
                    <TableHeader className="bg-slate-50/80 text-slate-600">
                      <TableRow>
                        <TableHead className="font-medium px-4 py-3 text-left">
                          ID
                        </TableHead>
                        <TableHead className="font-medium px-4 py-3 text-left">
                          Product
                        </TableHead>
                        <TableHead className="font-medium px-4 py-3 text-left">
                          SKU
                        </TableHead>
                        <TableHead className="font-medium px-4 py-3 text-left">
                          Price
                        </TableHead>
                        <TableHead className="font-medium px-4 py-3 text-left">
                          Cost
                        </TableHead>
                        <TableHead className="font-medium px-4 py-3 text-left">
                          Stock
                        </TableHead>
                        <TableHead className="font-medium px-4 py-3 text-left">
                          Updated
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="px-4 py-6 text-center text-slate-500"
                          >
                            No products.
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((p) => (
                          <TableRow
                            key={p.id}
                            className="border-t border-slate-100"
                          >
                            <TableCell className="px-4 py-3 text-slate-500">
                              {p.id}
                            </TableCell>
                            <TableCell className="px-4 py-3 font-medium text-slate-900">
                              {p.name}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              {p.internal_code}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              {p.price}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              {p.cost}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              {p.available_stock}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              {p.updated_at
                                ? new Date(p.updated_at).toLocaleString()
                                : "—"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
                {isError && (
                  <Alert className="m-4 border-red-200 bg-red-50 text-red-700">
                    <AlertDescription>Couldn’t load products.</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/*  ACTION FORMS GRID  */}
        <section className="grid gap-6 lg:grid-cols-2">
          <AddProductCard />
          <UpdateProductCard />
          <InactivateCard />
          <DeleteCard />
        </section>
      </main>
    </div>
  );
}

// Add product Card
function AddProductCard() {
  const queryClient = useQueryClient();

  const form = useForm<ProductCreate>({
    defaultValues: {
      name: "",
      internal_code: "",
      price: "0", // backend wants string(decimal) for money values
      cost: "0", // same as price
      available_stock: 0, // backend wants number
      platform: "",
      img_url: "",
      description: "",
    },
  });

  // POST /product/add-product/
  const addProduct = useAddProductProductAddProductPost();

  const handleSubmitForm = (values: ProductCreate) => {
    addProduct.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast.success(`Created: ${values.name}`);

          // refresh table
          queryClient.invalidateQueries({
            queryKey: ["/product/my-products/"],
          });

          // reset form
          form.reset();
        },
        onError: (err: any) => {
          console.error(err);
          toast.error(getApiErrorMessage(err), { autoClose: false });
        },
      }
    );
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
              onSubmit={form.handleSubmit(handleSubmitForm)}
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {/* name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Product name"
                          required
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* internal_code */}
                <FormField
                  control={form.control}
                  name="internal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Code (SKU)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SKU / internal"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* price */}
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
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* cost */}
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
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* available_stock */}
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
                          value={field.value ?? 0}
                          onChange={(e) => {
                            const raw = e.target.value;
                            field.onChange(raw === "" ? 0 : Number(raw));
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* platform */}
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Shopify, Etsy…"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* img_url */}
                <FormField
                  control={form.control}
                  name="img_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://…"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[90px]"
                        placeholder="Optional description"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
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
                  disabled={addProduct.isPending}
                >
                  {addProduct.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function UpdateProductCard() {
  const queryClient = useQueryClient();

  // form values = backend update shape + product_id path param
  type UpdateFormValues = ProductUpdate & {
    product_id: string;
  };

  const form = useForm<UpdateFormValues>({
    defaultValues: {
      product_id: "",
      name: "",
      description: "",
      available_stock: 0,
      price: "0",
      cost: "0",
      platform: "",
      img_url: "",
      internal_code: "",
      inactive: false,
    },
  });

  const updateProduct = useUpdateProductProductUpdateProductProductIdPatch();

  const handleSubmitForm = (values: UpdateFormValues) => {
    const {
      product_id,
      name,
      description,
      internal_code,
      platform,
      img_url,
      price,
      cost,
      available_stock,
      inactive,
    } = values;

    const productIdNum = Number(product_id);
    if (Number.isNaN(productIdNum)) {
      toast.error("Please enter a valid numeric Product ID.");
      return;
    }

    const body: Partial<ProductUpdate> = {};

    // send string fields only if not empty
    if (typeof name === "string" && name.trim() !== "") {
      body.name = name;
    }

    if (typeof description === "string" && description.trim() !== "") {
      body.description = description;
    }

    if (typeof internal_code === "string" && internal_code.trim() !== "") {
      body.internal_code = internal_code;
    }

    if (typeof platform === "string" && platform.trim() !== "") {
      body.platform = platform;
    }

    if (typeof img_url === "string" && img_url.trim() !== "") {
      body.img_url = img_url;
    }

    // number-ish fields
    if (price !== undefined && price !== null && `${price}`.trim() !== "") {
      const n = Number(price);
      if (!Number.isNaN(n)) {
        body.price = n;
      }
    }

    if (cost !== undefined && cost !== null && `${cost}`.trim() !== "") {
      const n = Number(cost);
      if (!Number.isNaN(n)) {
        body.cost = n;
      }
    }

    if (
      available_stock !== undefined &&
      available_stock !== null &&
      `${available_stock}`.trim() !== ""
    ) {
      const n = Number(available_stock);
      if (!Number.isNaN(n)) {
        body.available_stock = n;
      }
    }

    // send inactive flag only if true (you can change this if backend also expects false)
    if (inactive === true) {
      body.inactive = true;
    }

    if (Object.keys(body).length === 0) {
      toast.error("Please change at least one field before updating.");
      return;
    }

    updateProduct.mutate(
      {
        productId: productIdNum,
        data: body,
      },
      {
        onSuccess: () => {
          toast.success(`Updated product ${productIdNum}`);

          queryClient.invalidateQueries({
            queryKey: ["/product/my-products/"],
          });

          form.reset();
        },
        onError: (err: any) => {
          console.error(err);
          toast.error(getApiErrorMessage(err), { autoClose: false });
        },
      }
    );
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
              onSubmit={form.handleSubmit(handleSubmitForm)}
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Product ID (required, path param) */}
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
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Internal Code */}
                <FormField
                  control={form.control}
                  name="internal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SKU / internal"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
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
                          placeholder="0"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cost  */}
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
                          placeholder="0"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Available Stock */}
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
                          placeholder="0"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Platform */}
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Platform"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image URL */}
                <FormField
                  control={form.control}
                  name="img_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://…"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Inactive flag */}
                <FormField
                  control={form.control}
                  name="inactive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inactive?</FormLabel>
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300"
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          name={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[90px]"
                        placeholder="Description"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
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
                  disabled={updateProduct.isPending}
                >
                  {updateProduct.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

type InactivateValues = { product_id: number | string };

function InactivateCard() {
  const queryClient = useQueryClient();

  const form = useForm<InactivateValues>({
    defaultValues: { product_id: "" },
  });

  // PUT /product/inactive-product/{product_id}
  const inactiveProduct =
    useInactiveProductProductInactiveProductProductIdPut();

  const handleSubmitForm = (values: InactivateValues) => {
    const idNum = Number(values.product_id);
    inactiveProduct.mutate(
      {
        productId: idNum,
      },
      {
        onSuccess: () => {
          toast.success(`Product ${idNum} inactivated`);

          queryClient.invalidateQueries({
            queryKey: ["/product/my-products/"],
          });

          form.reset();
        },
        onError: (err: any) => {
          console.error(err);
          toast.error(getApiErrorMessage(err), { autoClose: false });
        },
      }
    );
  };

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
              onSubmit={form.handleSubmit(handleSubmitForm)}
              noValidate
            >
              {/* product_id */}
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
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="bg-amber-600 hover:bg-amber-700"
                type="submit"
                disabled={inactiveProduct.isPending}
              >
                {inactiveProduct.isPending ? "Inactivating..." : "Inactivate"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

type DeleteValues = { product_id: number | string };

function DeleteCard() {
  const queryClient = useQueryClient();

  const form = useForm<DeleteValues>({
    defaultValues: { product_id: "" },
  });

  // DELETE /product/delete-product/{product_id}
  const deleteProduct = useDeleteProductProductDeleteProductProductIdDelete();

  const handleSubmitForm = (values: DeleteValues) => {
    const idNum = Number(values.product_id);
    deleteProduct.mutate(
      {
        productId: idNum,
      },
      {
        onSuccess: () => {
          toast.success(`Deleted product ${idNum}`);

          queryClient.invalidateQueries({
            queryKey: ["/product/my-products/"],
          });

          form.reset();
        },
        onError: (err: any) => {
          console.error(err);
          toast.error(getApiErrorMessage(err), { autoClose: false });
        },
      }
    );
  };

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
              onSubmit={form.handleSubmit(handleSubmitForm)}
              noValidate
            >
              {/* product_id */}
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
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="bg-red-600 hover:bg-red-700"
                type="submit"
                disabled={deleteProduct.isPending}
              >
                {deleteProduct.isPending ? "Deleting..." : "Delete"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
