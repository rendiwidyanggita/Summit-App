import "dotenv/config";
import bcrypt from "bcryptjs";

import { catalogProducts } from "../src/lib/catalog-mock";
import { articleSeedData as sprint7Articles } from "../src/lib/article-seed-data";
import { prisma } from "../src/lib/db";

if (!process.env.DATABASE_URL) {
  console.log("Skipping seed: DATABASE_URL is not set.");
  process.exit(0);
}

const permissionData = [
  ["admin.access", "Akses Admin", "admin"],
  ["product.read", "Lihat Produk", "catalog"],
  ["product.write", "Kelola Produk", "catalog"],
  ["order.read", "Lihat Pesanan", "order"],
  ["order.write", "Kelola Pesanan", "order"],
  ["promo.write", "Kelola Promo", "marketing"],
  ["report.read", "Lihat Laporan", "reporting"],
  ["role.manage", "Kelola Role", "rbac"],
  ["review.moderate", "Moderasi Review", "trust"],
  ["return.manage", "Kelola Return", "support"],
  ["return.refund", "Proses Refund Return", "finance"],
  ["complaint.manage", "Kelola Komplain", "support"],
  ["article.write", "Kelola Artikel", "content"],
] as const;

const roles = [
  {
    code: "SUPER_ADMIN",
    name: "Super Admin",
    permissions: permissionData.map(([code]) => code),
  },
  {
    code: "ADMIN_OPERASIONAL",
    name: "Admin Operasional",
    permissions: ["admin.access", "product.read", "product.write", "order.read", "order.write"],
  },
  {
    code: "ADMIN_MARKETING",
    name: "Admin Marketing",
    permissions: ["admin.access", "promo.write", "product.read", "article.write"],
  },
  {
    code: "ADMIN_CUSTOMER_SERVICE",
    name: "Admin Customer Service",
    permissions: ["admin.access", "order.read", "review.moderate", "return.manage", "complaint.manage"],
  },
  {
    code: "ADMIN_FINANCE",
    name: "Admin Finance",
    permissions: ["admin.access", "order.read", "report.read", "return.manage", "return.refund"],
  },
];

const categoryData = [
  "Tenda",
  "Sleeping Bag",
  "Carrier",
  "Sepatu",
  "Jaket",
  "Harness",
  "Carabiner",
  "Headlamp",
  "Matras",
  "Cooking Set",
  "Aksesoris",
];

// Derive brand list from the mock catalog plus any baseline brands not in the mock.
const brandData = Array.from(
  new Set([...catalogProducts.map((product) => product.brand), "Summit Gear", "TrailForge", "RainPeak", "CampLab"]),
).sort();

// Gear checklist seed data. Items are linked to seeded products by slug; items
// without a productSlug are product-agnostic labels (e.g. P3K, Kompas).
const gearChecklists: Array<{
  slug: string;
  name: string;
  activity: string;
  description: string;
  sortOrder: number;
  items: Array<{ label: string; quantity: number; isOptional: boolean; productSlug?: string }>;
}> = [
  {
    slug: "pendakian-gunung",
    name: "Pendakian Gunung",
    activity: "pendakian",
    description: "Checklist standar untuk pendakian gunung tropis 2-3 hari.",
    sortOrder: 1,
    items: [
      { label: "Tenda 2P", quantity: 1, isOptional: false, productSlug: "summit-ridge-tent-2p" },
      { label: "Carrier 45L", quantity: 1, isOptional: false, productSlug: "alpine-45l-carrier" },
      { label: "Sleeping bag", quantity: 1, isOptional: false, productSlug: "polar-night-sleeping-bag" },
      { label: "Matras inflatable", quantity: 1, isOptional: false, productSlug: "rinjani-inflatable-mat" },
      { label: "Sepatu trail", quantity: 1, isOptional: false, productSlug: "merapi-trail-shoes" },
      { label: "Jaket shell", quantity: 1, isOptional: false, productSlug: "borneo-dry-shell-jacket" },
      { label: "Headlamp", quantity: 1, isOptional: false, productSlug: "lumentrail-headlamp-300" },
      { label: "Trekking pole", quantity: 1, isOptional: true, productSlug: "dry-trekking-pole-pair" },
      { label: "P3K dasar", quantity: 1, isOptional: false },
      { label: "Air minum 2L", quantity: 1, isOptional: false },
      { label: "Kompas atau GPS", quantity: 1, isOptional: true },
    ],
  },
  {
    slug: "tebing",
    name: "Panjat Tebing",
    activity: "tebing",
    description: "Checklist gear panjat tebing dasar untuk sport climbing.",
    sortOrder: 2,
    items: [
      { label: "Sepatu trail untuk approach", quantity: 1, isOptional: false, productSlug: "merapi-trail-shoes" },
      { label: "Headlamp", quantity: 1, isOptional: false, productSlug: "lumentrail-headlamp-300" },
      { label: "Daypack 25L", quantity: 1, isOptional: false, productSlug: "summit-daypack-25l" },
      { label: "Harness", quantity: 1, isOptional: false },
      { label: "Helm panjat", quantity: 1, isOptional: false },
      { label: "Carabiner set", quantity: 6, isOptional: false },
      { label: "Tali statis", quantity: 1, isOptional: false },
      { label: "Chalk bag", quantity: 1, isOptional: true },
      { label: "P3K dasar", quantity: 1, isOptional: false },
    ],
  },
  {
    slug: "camping",
    name: "Camping",
    activity: "camping",
    description: "Checklist camping ground untuk akhir pekan.",
    sortOrder: 3,
    items: [
      { label: "Tenda 2P", quantity: 1, isOptional: false, productSlug: "summit-ridge-tent-2p" },
      { label: "Sleeping bag", quantity: 2, isOptional: false, productSlug: "polar-night-sleeping-bag" },
      { label: "Matras inflatable", quantity: 2, isOptional: false, productSlug: "rinjani-inflatable-mat" },
      { label: "Kompor lipat", quantity: 1, isOptional: false, productSlug: "campfire-compact-stove" },
      { label: "Nesting cookware", quantity: 1, isOptional: false, productSlug: "basecamp-nesting-set" },
      { label: "Headlamp", quantity: 2, isOptional: false, productSlug: "lumentrail-headlamp-300" },
      { label: "Ponco hujan", quantity: 2, isOptional: true, productSlug: "java-rain-poncho" },
      { label: "Air minum 5L", quantity: 1, isOptional: false },
      { label: "Lampu camp", quantity: 1, isOptional: true },
    ],
  },
];

const sizeGuides: Array<{
  categorySlug: string;
  title: string;
  description: string;
  rows: Array<Record<string, string>>;
}> = [
  {
    categorySlug: "sepatu",
    title: "Panduan Ukuran Sepatu Trail",
    description: "Gunakan panjang kaki terpanjang dan sisakan ruang 0,5-1 cm untuk kaus kaki hiking.",
    rows: [
      { eu: "39", panjangKakiCm: "24.5", usMen: "6.5", rekomendasi: "Kaki ramping" },
      { eu: "40", panjangKakiCm: "25.2", usMen: "7", rekomendasi: "Pendakian harian" },
      { eu: "41", panjangKakiCm: "26.0", usMen: "8", rekomendasi: "Kaus kaki sedang" },
      { eu: "42", panjangKakiCm: "26.7", usMen: "9", rekomendasi: "Kaki lebar" },
      { eu: "43", panjangKakiCm: "27.5", usMen: "10", rekomendasi: "Trekking panjang" },
    ],
  },
  {
    categorySlug: "jaket",
    title: "Panduan Ukuran Jaket Outdoor",
    description: "Pilih ukuran dengan ruang layering untuk base layer dan fleece ringan.",
    rows: [
      { ukuran: "S", dadaCm: "88-94", panjangCm: "66", rekomendasi: "Tinggi 160-168 cm" },
      { ukuran: "M", dadaCm: "95-101", panjangCm: "69", rekomendasi: "Tinggi 168-175 cm" },
      { ukuran: "L", dadaCm: "102-108", panjangCm: "72", rekomendasi: "Tinggi 175-182 cm" },
      { ukuran: "XL", dadaCm: "109-116", panjangCm: "75", rekomendasi: "Layering tebal" },
    ],
  },
  {
    categorySlug: "carrier",
    title: "Panduan Fitting Carrier",
    description: "Sesuaikan kapasitas dan torso length agar beban jatuh ke pinggul, bukan bahu.",
    rows: [
      { kapasitas: "25-35L", durasi: "Day hike", torsoCm: "40-48", bebanIdeal: "5-8 kg" },
      { kapasitas: "40-50L", durasi: "1-2 malam", torsoCm: "43-52", bebanIdeal: "8-14 kg" },
      { kapasitas: "55-65L", durasi: "3-5 malam", torsoCm: "46-55", bebanIdeal: "14-20 kg" },
    ],
  },
];

const sprint4Vouchers = [
  {
    code: "SUMMIT50",
    type: "FIXED_AMOUNT" as const,
    value: 50000,
    minSpend: 500000,
    maxDiscount: null,
    quota: 100,
  },
  {
    code: "FREEONGKIR",
    type: "FREE_SHIPPING" as const,
    value: 40000,
    minSpend: 750000,
    maxDiscount: null,
    quota: 100,
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
}

async function main() {
  for (const [code, name, module] of permissionData) {
    await prisma.permission.upsert({
      where: { code },
      update: { name, module },
      create: { code, name, module },
    });
  }

  for (const role of roles) {
    const savedRole = await prisma.role.upsert({
      where: { code: role.code },
      update: { name: role.name },
      create: {
        code: role.code,
        name: role.name,
        description: `${role.name} Summit Gear`,
      },
    });

    for (const permissionCode of role.permissions) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: { code: permissionCode },
      });

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: savedRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: savedRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

  for (const name of categoryData) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: {
        name,
        imageUrl: catalogProducts.find((product) => product.category === name)?.images[0] ?? null,
        isVisible: true,
      },
      create: {
        name,
        slug: slugify(name),
        icon: "package",
        imageUrl: catalogProducts.find((product) => product.category === name)?.images[0] ?? null,
        isVisible: true,
        metaTitle: `${name} Summit Gear`,
        metaDescription: `Katalog ${name.toLowerCase()} untuk kebutuhan pendakian dan camping.`,
      },
    });
  }

  for (const name of brandData) {
    await prisma.brand.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) },
    });
  }

  // Mirror the full mock catalog into the DB.
  // Mock convention: `compareAt > price` means there is a discount. Map to
  // schema as `price = max(compareAt, price)` and `discountPrice = compareAt > price ? price : null`
  // so the catalog service's "discountOnly" filter (discountPrice IS NOT NULL) works correctly.
  for (const item of catalogProducts) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: item.categorySlug },
    });
    const brand = await prisma.brand.findUniqueOrThrow({
      where: { slug: slugify(item.brand) },
    });

    const hasDiscount = item.compareAt > item.price;
    const price = hasDiscount ? item.compareAt : item.price;
    const discountPrice = hasDiscount ? item.price : null;
    const isFeatured = item.isNew === true || item.sold > 100;
    const ratingCount = Math.max(1, Math.round(item.sold / 3));

    const productPayload = {
      name: item.name,
      description: item.description,
      categoryId: category.id,
      brandId: brand.id,
      weightGram: item.weightGram,
      price,
      costPrice: Math.round(Number(price) * 0.65),
      discountPrice,
      photos: item.images,
      tags: item.tags,
      // Cast to satisfy Prisma JsonValue typing.
      specs: item.specs as unknown as object,
      ratingAvg: item.rating,
      ratingCount,
      soldCount: item.sold,
      isFeatured,
      status: "ACTIVE" as const,
      metaTitle: item.name,
      metaDescription: item.description.slice(0, 160),
    };

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: productPayload,
      create: {
        slug: item.slug,
        ...productPayload,
      },
    });

    for (const variant of item.variants) {
      // The mock's `variant.name` may be a size ("EU 40") or color ("Forest Green").
      // For MVP we store it in `size`; admin module in a later sprint can split
      // size/color properly when CRUD UI lands.
      await prisma.productVariant.upsert({
        where: { sku: variant.sku },
        update: {
          productId: product.id,
          size: variant.name,
          stock: variant.stock,
          minimumStock: 10,
          isActive: true,
          priceModifier: variant.priceModifier ?? 0,
        },
        create: {
          productId: product.id,
          sku: variant.sku,
          size: variant.name,
          stock: variant.stock,
          minimumStock: 10,
          isActive: true,
          priceModifier: variant.priceModifier ?? 0,
        },
      });
    }
  }

  // Gear checklist seed: idempotent — upsert checklist by slug, then replace
  // its items wholesale so re-running the seed does not duplicate them.
  for (const checklist of gearChecklists) {
    const saved = await prisma.gearChecklist.upsert({
      where: { slug: checklist.slug },
      update: {
        name: checklist.name,
        activity: checklist.activity,
        description: checklist.description,
        sortOrder: checklist.sortOrder,
        isActive: true,
      },
      create: {
        slug: checklist.slug,
        name: checklist.name,
        activity: checklist.activity,
        description: checklist.description,
        sortOrder: checklist.sortOrder,
        isActive: true,
      },
    });

    await prisma.gearChecklistItem.deleteMany({ where: { checklistId: saved.id } });

    let order = 0;
    for (const rawItem of checklist.items) {
      let productId: string | null = null;
      if (rawItem.productSlug) {
        const product = await prisma.product.findUnique({
          where: { slug: rawItem.productSlug },
          select: { id: true },
        });
        productId = product?.id ?? null;
      }

      await prisma.gearChecklistItem.create({
        data: {
          checklistId: saved.id,
          productId,
          label: rawItem.label,
          quantity: rawItem.quantity,
          isOptional: rawItem.isOptional,
          sortOrder: order,
        },
      });

      order += 1;
    }
  }

  for (const guide of sizeGuides) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: guide.categorySlug },
    });

    await prisma.sizeGuide.upsert({
      where: {
        categoryId_title: {
          categoryId: category.id,
          title: guide.title,
        },
      },
      update: {
        description: guide.description,
        rows: guide.rows,
        isActive: true,
      },
      create: {
        categoryId: category.id,
        title: guide.title,
        description: guide.description,
        rows: guide.rows,
        isActive: true,
      },
    });
  }

  await prisma.banner.upsert({
    where: { id: "foundation-homepage-banner" },
    update: {
      title: "Summit Gear Launch",
      placement: "HOME_HERO",
      isActive: true,
    },
    create: {
      id: "foundation-homepage-banner",
      title: "Summit Gear Launch",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80",
      targetUrl: "/produk",
      placement: "HOME_HERO",
      sortOrder: 1,
      isActive: true,
    },
  });

  for (const voucher of sprint4Vouchers) {
    await prisma.voucher.upsert({
      where: { code: voucher.code },
      update: {
        name: voucher.code === "SUMMIT50" ? "Potongan gear pendakian" : "Gratis ongkir basecamp",
        type: voucher.type,
        value: voucher.value,
        minSpend: voucher.minSpend,
        maxDiscount: voucher.maxDiscount,
        quota: voucher.quota,
        startsAt: new Date("2026-01-01T00:00:00.000Z"),
        endsAt: new Date("2026-12-31T23:59:59.999Z"),
        status: "ACTIVE",
      },
      create: {
        code: voucher.code,
        name: voucher.code === "SUMMIT50" ? "Potongan gear pendakian" : "Gratis ongkir basecamp",
        type: voucher.type,
        value: voucher.value,
        minSpend: voucher.minSpend,
        maxDiscount: voucher.maxDiscount,
        quota: voucher.quota,
        startsAt: new Date("2026-01-01T00:00:00.000Z"),
        endsAt: new Date("2026-12-31T23:59:59.999Z"),
        status: "ACTIVE",
      },
    });
  }

  const passwordHash = await bcrypt.hash("Password123!", 12);
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { code: "SUPER_ADMIN" } });
  const demoAdmin = await prisma.user.upsert({
    where: { email: "admin@summitgear.local" },
    update: { name: "Summit Admin", passwordHash },
    create: {
      email: "admin@summitgear.local",
      name: "Summit Admin",
      passwordHash,
      emailVerified: new Date(),
    },
  });

  await prisma.adminUser.upsert({
    where: { userId: demoAdmin.id },
    update: { roleId: adminRole.id, status: "ACTIVE" },
    create: {
      userId: demoAdmin.id,
      roleId: adminRole.id,
      status: "ACTIVE",
    },
  });

  for (const article of sprint7Articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        tags: [...article.tags],
        content: article.content.join("\n\n"),
        imageUrl: article.image,
        authorId: demoAdmin.id,
        status: "PUBLISHED",
        publishedAt: new Date(),
        metaTitle: article.title,
        metaDescription: article.excerpt,
      },
      create: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        category: article.category,
        tags: [...article.tags],
        content: article.content.join("\n\n"),
        imageUrl: article.image,
        authorId: demoAdmin.id,
        status: "PUBLISHED",
        publishedAt: new Date(),
        metaTitle: article.title,
        metaDescription: article.excerpt,
      },
    });
  }

  const productCount = await prisma.product.count();
  const variantCount = await prisma.productVariant.count();
  const checklistCount = await prisma.gearChecklist.count();
  const checklistItemCount = await prisma.gearChecklistItem.count();
  const sizeGuideCount = await prisma.sizeGuide.count();
  const voucherCount = await prisma.voucher.count();
  console.log(
    `Seed completed. products=${productCount} variants=${variantCount} checklists=${checklistCount} items=${checklistItemCount} sizeGuides=${sizeGuideCount} vouchers=${voucherCount}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
