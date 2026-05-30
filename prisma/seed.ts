import "dotenv/config";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  console.log("Skipping seed: DATABASE_URL is not set.");
  process.exit(0);
}

const { prisma } = await import("../src/lib/db");

const permissionData = [
  ["admin.access", "Akses Admin", "admin"],
  ["product.read", "Lihat Produk", "catalog"],
  ["product.write", "Kelola Produk", "catalog"],
  ["order.read", "Lihat Pesanan", "order"],
  ["order.write", "Kelola Pesanan", "order"],
  ["promo.write", "Kelola Promo", "marketing"],
  ["report.read", "Lihat Laporan", "reporting"],
  ["role.manage", "Kelola Role", "rbac"],
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
    permissions: ["admin.access", "promo.write", "product.read"],
  },
  {
    code: "ADMIN_CUSTOMER_SERVICE",
    name: "Admin Customer Service",
    permissions: ["admin.access", "order.read"],
  },
  {
    code: "ADMIN_FINANCE",
    name: "Admin Finance",
    permissions: ["admin.access", "order.read", "report.read"],
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

const brandData = ["Summit Gear", "TrailForge", "RainPeak", "CampLab"];

function slugify(value: string) {
  return value.toLowerCase().replaceAll(" ", "-");
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
      update: { name },
      create: {
        name,
        slug: slugify(name),
        icon: "package",
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

  const category = await prisma.category.findUniqueOrThrow({ where: { slug: "tenda" } });
  const brand = await prisma.brand.findUniqueOrThrow({ where: { slug: "summit-gear" } });

  const products = [
    ["Summit Ridge Tent 2P", "Tenda ringan 2 orang untuk pendakian tropis.", 1450000, 1690000, 18],
    ["Alpine 45L Carrier", "Carrier 45 liter dengan frame ringan dan rain cover.", 875000, 990000, 9],
    ["Borneo Dry Shell Jacket", "Jaket shell tahan angin dan hujan ringan.", 625000, null, 22],
    ["Campfire Compact Stove", "Kompor camping ringkas untuk perjalanan 1-3 hari.", 315000, 385000, 31],
  ] as const;

  for (const [name, description, price, discountPrice, stock] of products) {
    const product = await prisma.product.upsert({
      where: { slug: slugify(name) },
      update: {
        name,
        description,
        price,
        discountPrice,
        status: "ACTIVE",
      },
      create: {
        name,
        slug: slugify(name),
        description,
        categoryId: category.id,
        brandId: brand.id,
        weightGram: 1200,
        price,
        discountPrice,
        photos: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80"],
        status: "ACTIVE",
        metaTitle: name,
        metaDescription: description,
      },
    });

    await prisma.productVariant.upsert({
      where: { sku: `${product.slug.toUpperCase().slice(0, 12)}-STD` },
      update: { stock },
      create: {
        productId: product.id,
        sku: `${product.slug.toUpperCase().slice(0, 12)}-STD`,
        size: "Standard",
        stock,
        minimumStock: 10,
      },
    });
  }

  await prisma.banner.upsert({
    where: { id: "foundation-homepage-banner" },
    update: {
      title: "Summit Gear Launch",
      isActive: true,
    },
    create: {
      id: "foundation-homepage-banner",
      title: "Summit Gear Launch",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80",
      targetUrl: "/produk",
      sortOrder: 1,
      isActive: true,
    },
  });

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

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
