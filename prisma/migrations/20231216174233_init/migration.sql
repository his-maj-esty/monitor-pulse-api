-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Stats" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL,
    "websiteId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Website_id_key" ON "Website"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Website_name_key" ON "Website"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stats_id_key" ON "Stats"("id");

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
