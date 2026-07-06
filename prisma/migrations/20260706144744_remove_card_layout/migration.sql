-- Drop unused per-project layout; works grid now uses a fixed 7-slot template in code.
ALTER TABLE "Project" DROP COLUMN "cardLayout";
