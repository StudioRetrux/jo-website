-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "thumbnail" JSONB NOT NULL,
    "hoverImage" JSONB,
    "cardLayout" JSONB,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "year" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "slides" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "HomeConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
