"use client";

import {
  useMyProductsProductMyProductsGet,
  useProductsAvailableProductProductsAvailableGet,
  useTopLucrativeProductsProductTopLucrativeProductsGet,
  useEstimatedProfitProductEstimatedProfitGet,
  useLowStockItemsProductLowStockItemsValueGet,
} from "@/generated/product/product";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Boxes,
  Package,
  BarChart3,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import * as React from "react";

/* recharts */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

/* ---------------------- helpers to unwrap `unknown` ---------------------- */
const asArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const asRecord = (v: unknown): Record<string, any> | undefined =>
  v && typeof v === "object" ? (v as Record<string, any>) : undefined;

/* ------------------------------ UI pieces ------------------------------ */
function Stat({
  label,
  value,
  sub,
  icon: Icon,
  loading,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon: any;
  loading?: boolean;
}) {
  return (
    <Card className="border-slate-200 hover:shadow-md transition">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {loading ? "—" : value}
              </span>
              {sub ? (
                <span className="text-xs text-slate-500">{sub}</span>
              ) : null}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <Icon className="h-6 w-6 text-slate-600" />
          </div>
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full ${
              loading
                ? "w-1/3 bg-slate-200 animate-pulse"
                : "w-full bg-slate-100"
            }`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------ main page ------------------------------ */
export function UserDashboardPage() {
  /* user-controlled GET params */
  const [mode, setMode] = React.useState<"all" | "first" | "last">("all");
  const [n, setN] = React.useState<number>(5);
  const [lowThreshold, setLowThreshold] = React.useState<number>(20);

  // GET: /product/my-products?mode=<mode>&n=<n>
  const {
    data: myProductsRaw,
    isLoading: loadingMyProducts,
    error: errMyProducts,
  } = useMyProductsProductMyProductsGet({ mode, n });

  // GET: /product/products-available
  const {
    data: availableRaw,
    isLoading: loadingAvailable,
    error: errAvailable,
  } = useProductsAvailableProductProductsAvailableGet();

  // GET: /product/top-lucrative-products
  const {
    data: topLucrativeRaw,
    isLoading: loadingTop,
    error: errTop,
  } = useTopLucrativeProductsProductTopLucrativeProductsGet();

  // GET: /product/estimated-profit
  const {
    data: estimatedRaw,
    isLoading: loadingEst,
    error: errEst,
  } = useEstimatedProfitProductEstimatedProfitGet();

  // GET: /product/low-stock-items/{value}
  const {
    data: lowStockRaw,
    isLoading: loadingLow,
    error: errLow,
  } = useLowStockItemsProductLowStockItemsValueGet(lowThreshold);

  /* ------------------------------ unwrapped data ------------------------------ */
  const myProducts = asArray<any>(myProductsRaw);
  const available = asRecord(availableRaw);
  const estimated = asRecord(estimatedRaw);
  const topLucrative = asRecord(topLucrativeRaw);
  const lowStockRec = asRecord(lowStockRaw);

  const lowStockDetail =
    typeof lowStockRec?.detail === "string" ? lowStockRec.detail : undefined;

  const lowStockGroup = Array.isArray(lowStockRec?.["You need more stock of "])
    ? (lowStockRec?.["You need more stock of "] as Array<{
        name: string;
        "stock available": number;
      }>)
    : undefined;

  const topList: Array<[string, any]> = topLucrative
    ? Object.entries(topLucrative)
    : [];

  const losingProducts = asArray<any>(estimated?.losing_products);
  const stockCost = estimated?.["stock cost"];
  const estProfit = estimated?.profit;
  const availableStock = available?.available_stock;
  const totalPrice = available?.total_price;

  /* Chart data from /top-lucrative-products */
  const chartData =
    loadingTop || topList.length === 0
      ? [
          { name: "—", profit: 0 },
          { name: "—", profit: 0 },
          { name: "—", profit: 0 },
        ]
      : topList.map(([name, obj]) => ({
          name,
          profit: Number(obj?.profit ?? 0),
        }));

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {(errMyProducts || errAvailable || errTop || errEst || errLow) && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
            Some data couldn’t be loaded. Showing what’s available.
          </div>
        )}

        {/* KPIs */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Stat
              label="Total Products"
              value={myProducts.length}
              sub={`mode: ${mode}`}
              icon={Package}
              loading={loadingMyProducts}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Stat
              label="Available Stock"
              value={availableStock ?? "0"}
              sub="units"
              icon={Boxes}
              loading={loadingAvailable}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Stat
              label="Estimated Profit"
              value={estProfit ?? "0"}
              sub="total"
              icon={DollarSign}
              loading={loadingEst}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Stat
              label="Low Stock Items"
              value={(lowStockGroup ?? []).length}
              sub={`threshold: ${lowThreshold}`}
              icon={AlertTriangle}
              loading={loadingLow}
            />
          </motion.div>
        </section>

        {/* Chart + Top Lucrative */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Recharts bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-slate-600" />
                      Profit per Product
                    </h3>
                  </div>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="profit" fill="#008541" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                    Stock cost:{" "}
                    <span className="font-semibold text-slate-900">
                      {loadingEst ? "—" : (stockCost ?? "—")}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                    Total price:{" "}
                    <span className="font-semibold text-slate-900">
                      {loadingAvailable ? "—" : (totalPrice ?? "—")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top lucrative list */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-slate-600" />
                  Top Lucrative Products
                </h3>
                <p className="text-sm text-slate-600 mb-4">Profit / unit</p>
                <ul className="space-y-3">
                  {(loadingTop ? Array.from({ length: 3 }) : topList).map(
                    (entry, i) => {
                      const [name, obj] = Array.isArray(entry)
                        ? (entry as [string, any])
                        : (["—", { profit: "—" }] as [string, any]);
                      return (
                        <li
                          key={i}
                          className="flex items-center justify-between rounded-xl border border-slate-200 p-3 bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 grid place-items-center">
                              <Package className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {name}
                              </p>
                              <p className="text-xs text-slate-500">
                                Profit / unit: {obj?.profit ?? "—"}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                            {obj?.profit ?? "—"}
                          </span>
                        </li>
                      );
                    }
                  )}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* My products table with inline controls */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-slate-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col gap-3 p-4 border-b border-slate-200 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      My Products
                    </h3>
                    <p className="text-sm text-slate-600">
                      Showing{" "}
                      <span className="font-medium">{myProducts.length}</span>{" "}
                      items
                    </p>
                  </div>

                  {/* inline controls for mode + n */}
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
                      Number of products
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={n}
                      onChange={(e) =>
                        setN(Math.max(1, Number(e.target.value)))
                      }
                      className="h-9 w-24 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    />
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
                        <th className="text-left font-medium px-4 py-3">
                          Price
                        </th>
                        <th className="text-left font-medium px-4 py-3">
                          Cost
                        </th>
                        <th className="text-left font-medium px-4 py-3">
                          Stock
                        </th>
                        <th className="text-left font-medium px-4 py-3">
                          Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingMyProducts
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-t border-slate-100">
                              {Array.from({ length: 7 }).map((__, j) => (
                                <td key={j} className="px-4 py-3">
                                  <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                                </td>
                              ))}
                            </tr>
                          ))
                        : myProducts.map((p: any) => (
                            <tr
                              key={p.id}
                              className="border-t border-slate-100"
                            >
                              <td className="px-4 py-3 text-slate-500">
                                {p.id}
                              </td>
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
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Low stock & losing products, with inline threshold */}
        <section className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      Low Stock Items
                    </h3>
                    <span className="text-sm text-slate-500">
                      ({(lowStockGroup ?? []).length})
                    </span>
                  </div>

                  {/* inline threshold control */}

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-slate-600">
                      Threshold
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={lowThreshold}
                      onChange={(e) =>
                        setLowThreshold(Math.max(1, Number(e.target.value)))
                      }
                      className="h-9 w-24 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    />
                  </div>
                </div>
                {!loadingLow && lowStockDetail ? (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
                    {lowStockDetail}
                  </div>
                ) : (
                  <ul className="space-y-3 mt-4">
                    {(loadingLow
                      ? Array.from({ length: 4 })
                      : (lowStockGroup ?? [])
                    ).map((item: any, i: number) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200 grid place-items-center">
                            <Boxes className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {loadingLow ? "—" : item?.name}
                            </p>
                            <p className="text-xs font-semibold text-slate-500">
                              Stock:{" "}
                              <span className=" text-red-500">
                                {loadingLow ? "—" : item?.["stock available"]}
                              </span>
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Losing products */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Losing Products
                </h3>
                <div className="space-y-3">
                  {loadingEst
                    ? Array.from({ length: 2 }).map((_, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-slate-200 p-3"
                        >
                          <div className="h-4 w-40 bg-slate-100 rounded animate-pulse" />
                        </div>
                      ))
                    : losingProducts.map((lp: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-xl border border-slate-200 p-3 bg-slate-50"
                        >
                          <p className="font-medium text-red-800">{lp?.name}</p>
                          <p className="text-xs text-red-950">
                            Loss per unit: {lp?.["loss on each product"]}
                          </p>
                        </div>
                      ))}
                  {!loadingEst && losingProducts.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No losing products.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboardPage;
