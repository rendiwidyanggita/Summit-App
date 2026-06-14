-- Sprint 6 admin commerce operational fields.
CREATE TYPE "BannerPlacement" AS ENUM ('HOME_HERO', 'PROMO_STRIP', 'CATALOG_TOP');

ALTER TABLE "Product" ADD COLUMN "costPrice" DECIMAL(12,2) NOT NULL DEFAULT 0;
ALTER TABLE "ProductVariant" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "Category" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Category" ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "Voucher" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';

ALTER TABLE "Banner" ADD COLUMN "placement" "BannerPlacement" NOT NULL DEFAULT 'HOME_HERO';

CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");
CREATE INDEX "AuditLog_module_createdAt_idx" ON "AuditLog"("module", "createdAt");
