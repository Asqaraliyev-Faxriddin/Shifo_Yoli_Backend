/*
  Warnings:

  - You are about to drop the column `salary` on the `DoctorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `messageEn` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `messageRu` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `messageUz` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `Message` table. All the data in the column will be lost.
  - The `fileUrl` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `categoryId` on table `DoctorProfile` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `chatId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subcriptionId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Answer" DROP CONSTRAINT "Answer_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Answer" DROP CONSTRAINT "Answer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DoctorProfile" DROP CONSTRAINT "DoctorProfile_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_userId_fkey";

-- AlterTable
ALTER TABLE "public"."BlockedUsers" ADD COLUMN     "deviceId" TEXT;

-- AlterTable
ALTER TABLE "public"."DoctorProfile" DROP COLUMN "salary",
ALTER COLUMN "categoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "messageEn",
DROP COLUMN "messageRu",
DROP COLUMN "messageUz",
DROP COLUMN "receiverId",
ADD COLUMN     "Video_Url" JSONB,
ADD COLUMN     "chatId" TEXT NOT NULL,
ADD COLUMN     "text_en" TEXT,
ADD COLUMN     "text_ru" TEXT,
ADD COLUMN     "text_uz" TEXT,
DROP COLUMN "fileUrl",
ADD COLUMN     "fileUrl" JSONB;

-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "subcriptionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Answer";

-- DropTable
DROP TABLE "public"."Messages";

-- DropTable
DROP TABLE "public"."Question";

-- CreateTable
CREATE TABLE "public"."DoctorSalary" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "daily" DECIMAL(65,30),
    "weekly" DECIMAL(65,30),
    "monthly" DECIMAL(65,30),
    "yearly" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorSalary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatParticipant" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChatParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorSalary_doctorId_key" ON "public"."DoctorSalary"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_id_key" ON "public"."Chat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatParticipant_chatId_userId_key" ON "public"."ChatParticipant"("chatId", "userId");

-- AddForeignKey
ALTER TABLE "public"."DoctorProfile" ADD CONSTRAINT "DoctorProfile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."DoctorCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DoctorSalary" ADD CONSTRAINT "DoctorSalary_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."DoctorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_subcriptionId_fkey" FOREIGN KEY ("subcriptionId") REFERENCES "public"."Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlockedUsers" ADD CONSTRAINT "BlockedUsers_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "public"."Device"("deviceId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatParticipant" ADD CONSTRAINT "ChatParticipant_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatParticipant" ADD CONSTRAINT "ChatParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
