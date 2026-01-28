-- CreateTable
CREATE TABLE "Sport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportEvent" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "importance" INTEGER NOT NULL DEFAULT 1,
    "location" TEXT,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SportEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sport_slug_key" ON "Sport"("slug");

-- CreateIndex
CREATE INDEX "SportEvent_day_month_idx" ON "SportEvent"("day", "month");

-- CreateIndex
CREATE INDEX "SportEvent_sportId_idx" ON "SportEvent"("sportId");

-- AddForeignKey
ALTER TABLE "SportEvent" ADD CONSTRAINT "SportEvent_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
