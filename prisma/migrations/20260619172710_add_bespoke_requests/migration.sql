-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'QUOTED', 'APPROVED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "BespokeRequest" (
    "id" TEXT NOT NULL,
    "referenceNo" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "timber" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "notes" TEXT,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BespokeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BespokeRequest_referenceNo_key" ON "BespokeRequest"("referenceNo");
