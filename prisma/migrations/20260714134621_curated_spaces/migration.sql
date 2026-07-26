-- CreateTable
CREATE TABLE "CuratedSpacesConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "items" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "CuratedSpacesConfig_pkey" PRIMARY KEY ("id")
);
