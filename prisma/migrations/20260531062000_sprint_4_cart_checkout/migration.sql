-- Ensure one active cart per user before adding the unique constraint.
-- If duplicate carts exist in development data, merge duplicate cart items into
-- the most recently updated cart for that user and then delete the empty carts.

CREATE TEMP TABLE "_CartDedup" AS
SELECT
  "id" AS "duplicateCartId",
  first_value("id") OVER (
    PARTITION BY "userId"
    ORDER BY "updatedAt" DESC, "createdAt" DESC, "id" DESC
  ) AS "keeperCartId"
FROM "Cart";

DELETE FROM "_CartDedup"
WHERE "duplicateCartId" = "keeperCartId";

UPDATE "CartItem" AS target
SET "quantity" = target."quantity" + source."quantity"
FROM "CartItem" AS source
JOIN "_CartDedup" AS dedup
  ON dedup."duplicateCartId" = source."cartId"
WHERE target."cartId" = dedup."keeperCartId"
  AND target."productId" = source."productId"
  AND target."variantId" IS NOT DISTINCT FROM source."variantId";

DELETE FROM "CartItem" AS source
USING "_CartDedup" AS dedup, "CartItem" AS target
WHERE source."cartId" = dedup."duplicateCartId"
  AND target."cartId" = dedup."keeperCartId"
  AND target."productId" = source."productId"
  AND target."variantId" IS NOT DISTINCT FROM source."variantId";

UPDATE "CartItem" AS item
SET "cartId" = dedup."keeperCartId"
FROM "_CartDedup" AS dedup
WHERE item."cartId" = dedup."duplicateCartId";

DELETE FROM "Cart"
USING "_CartDedup" AS dedup
WHERE "Cart"."id" = dedup."duplicateCartId";

DROP TABLE "_CartDedup";

CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");
