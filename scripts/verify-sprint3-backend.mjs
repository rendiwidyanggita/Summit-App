import { spawn, execFileSync } from "node:child_process";
import "dotenv/config";

const port = Number(process.env.VERIFY_PORT ?? 3103);
const baseUrl = `http://localhost:${port}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let i = 0; i < 30; i += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      // wait
    }

    await sleep(1000);
  }

  throw new Error("Server did not become ready.");
}

async function request(path, init) {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  const text = await response.text();
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  return {
    path,
    status: response.status,
    length: text.length,
    json,
  };
}

function assertCheck(condition, label, details) {
  if (!condition) {
    throw new Error(`${label} failed${details ? `: ${details}` : ""}`);
  }
}

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
});

const logs = [];
server.stdout.on("data", (chunk) => logs.push(chunk.toString()));
server.stderr.on("data", (chunk) => logs.push(chunk.toString()));

const checks = [];

try {
  await waitForServer();

  const products = await request("/api/products?page=1&pageSize=4");
  checks.push(products);
  assertCheck(products.status === 200, "products status");
  assertCheck(products.json?.data?.items?.length > 0, "products items");
  assertCheck(products.json?.data?.pagination?.pageSize === 4, "products pagination");

  const firstProduct = products.json.data.items[0];

  const categoryFilter = await request(`/api/products?category=${firstProduct.category.slug}&pageSize=20`);
  checks.push(categoryFilter);
  assertCheck(categoryFilter.status === 200, "category filter status");
  assertCheck(categoryFilter.json.data.items.every((item) => item.category.slug === firstProduct.category.slug), "category filter data");

  const brandFilter = await request(`/api/products?brand=${firstProduct.brand.slug}&pageSize=20`);
  checks.push(brandFilter);
  assertCheck(brandFilter.status === 200, "brand filter status");
  assertCheck(brandFilter.json.data.items.every((item) => item.brand.slug === firstProduct.brand.slug), "brand filter data");

  const priceFilter = await request("/api/products?minPrice=100000&maxPrice=5000000&pageSize=20");
  checks.push(priceFilter);
  assertCheck(priceFilter.status === 200, "price filter status");
  assertCheck(priceFilter.json.data.items.every((item) => item.price >= 100000 && item.price <= 5000000), "price filter data");

  const ratingSort = await request("/api/products?sort=rating_desc&pageSize=10");
  checks.push(ratingSort);
  assertCheck(ratingSort.status === 200, "rating sort status");

  const discountFilter = await request("/api/products?discountOnly=true&pageSize=20");
  checks.push(discountFilter);
  assertCheck(discountFilter.status === 200, "discount filter status");
  assertCheck(discountFilter.json.data.items.every((item) => item.discountPrice !== null), "discount filter data");

  const inStockFilter = await request("/api/products?inStockOnly=true&pageSize=20");
  checks.push(inStockFilter);
  assertCheck(inStockFilter.status === 200, "stock filter status");
  assertCheck(inStockFilter.json.data.items.every((item) => item.variants.some((variant) => variant.stock > 0)), "stock filter data");

  const detail = await request(`/api/products/${firstProduct.slug}`);
  checks.push(detail);
  assertCheck(detail.status === 200, "product detail status");
  assertCheck(detail.json.data.slug === firstProduct.slug, "product detail slug");

  const missingDetail = await request("/api/products/not-a-real-product");
  checks.push(missingDetail);
  assertCheck(missingDetail.status === 404, "missing product status");

  const related = await request(`/api/products/${firstProduct.slug}/related?limit=3`);
  checks.push(related);
  assertCheck(related.status === 200, "related status");
  assertCheck(Array.isArray(related.json.data), "related payload");

  const suggestShort = await request("/api/products/suggest?q=t");
  checks.push(suggestShort);
  assertCheck(suggestShort.status === 200, "suggest short status");
  assertCheck(suggestShort.json.data.length === 0, "suggest short empty");

  const suggest = await request("/api/products/suggest?q=te&limit=5");
  checks.push(suggest);
  assertCheck(suggest.status === 200, "suggest status");
  assertCheck(suggest.json.data.length <= 5, "suggest limit");

  const homeFeed = await request("/api/home-feed");
  checks.push(homeFeed);
  assertCheck(homeFeed.status === 200, "home feed status");
  assertCheck(Array.isArray(homeFeed.json.data.banners), "home feed banners");
  assertCheck(Array.isArray(homeFeed.json.data.featured), "home feed featured");

  const categories = await request("/api/categories");
  checks.push(categories);
  assertCheck(categories.status === 200, "categories status");
  assertCheck(categories.json.data.length > 0, "categories payload");

  const brands = await request("/api/brands");
  checks.push(brands);
  assertCheck(brands.status === 200, "brands status");
  assertCheck(brands.json.data.length > 0, "brands payload");

  const checklists = await request("/api/gear-checklists");
  checks.push(checklists);
  assertCheck(checklists.status === 200, "gear checklist status");
  assertCheck(checklists.json.data.length > 0, "gear checklist payload");

  const checklistDetail = await request(`/api/gear-checklists/${checklists.json.data[0].slug}`);
  checks.push(checklistDetail);
  assertCheck(checklistDetail.status === 200, "gear checklist detail status");
  assertCheck(checklistDetail.json.data.items.length > 0, "gear checklist detail items");

  const sizeGuides = await request("/api/size-guides");
  checks.push(sizeGuides);
  assertCheck(sizeGuides.status === 200, "size guides status");
  assertCheck(sizeGuides.json.data.length > 0, "size guides payload");

  const sizeGuideDetail = await request("/api/size-guides/sepatu");
  checks.push(sizeGuideDetail);
  assertCheck(sizeGuideDetail.status === 200, "size guide category status");
  assertCheck(sizeGuideDetail.json.data[0].rows.length > 0, "size guide rows");

  const searchHistoryGuest = await request("/api/search-history");
  checks.push(searchHistoryGuest);
  assertCheck(searchHistoryGuest.status === 401, "search history guest status");

  const sitemap = await request("/sitemap.xml", {
    headers: {
      accept: "application/xml",
    },
  });
  checks.push(sitemap);
  assertCheck(sitemap.status === 200, "sitemap status");
  assertCheck(sitemap.length > 500, "sitemap length");

  console.table(checks.map(({ path, status, length }) => ({ path, status, length })));
} catch (error) {
  console.error(error);
  console.error(logs.join(""));
  process.exitCode = 1;
} finally {
  if (process.platform === "win32" && server.pid) {
    try {
      execFileSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore" });
    } catch {
      server.kill("SIGTERM");
    }
  } else {
    server.kill("SIGTERM");
  }

  await sleep(1000);

  if (!server.killed) {
    server.kill("SIGKILL");
  }
}
