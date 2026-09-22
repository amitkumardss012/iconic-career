-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'COMPLETED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXTENDED', 'PAUSED', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "EnrollmentSource" AS ENUM ('STUDENT_SELF', 'ADMIN_MANUAL', 'SYSTEM_IMPORT');

-- CreateEnum
CREATE TYPE "EnrollmentPaymentStatus" AS ENUM ('FREE', 'PAID', 'PARTIALLY_PAID', 'WAIVED', 'PENDING');

-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('MANUAL_ADMIN', 'RAZORPAY', 'STRIPE', 'CASHFREE', 'INSTAMOJO');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('UPI', 'NET_BANKING', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH', 'CHEQUE', 'WALLET', 'SCHOLARSHIP', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PAYMENT', 'REFUND', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "DegreeLevel" AS ENUM ('UG', 'PG', 'DIPLOMA', 'DOCTORATE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('COURSE', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProgramLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS');

-- CreateEnum
CREATE TYPE "DeliveryMode" AS ENUM ('ONLINE', 'OFFLINE', 'HYBRID');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gender" "Gender",
    "parentName" TEXT,
    "parentPhone" TEXT,
    "parentEmail" TEXT,
    "relationship" TEXT,
    "university" TEXT,
    "college" TEXT NOT NULL,
    "degreeLevel" "DegreeLevel" DEFAULT 'UG',
    "department" TEXT,
    "course" TEXT NOT NULL,
    "subject" TEXT,
    "session" TEXT,
    "registrationNumber" TEXT,
    "consentLetter" JSONB,
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "city" TEXT,
    "state" TEXT,
    "emergencyContact" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "thumbnail" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ProgramType" NOT NULL DEFAULT 'COURSE',
    "status" "ProgramStatus" NOT NULL DEFAULT 'DRAFT',
    "level" "ProgramLevel" NOT NULL DEFAULT 'ALL_LEVELS',
    "deliveryMode" "DeliveryMode" NOT NULL DEFAULT 'HYBRID',
    "categoryId" INTEGER NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "highlights" JSONB,
    "learningOutcomes" JSONB,
    "prerequisites" JSONB,
    "tags" JSONB,
    "thumbnail" JSONB,
    "banner" JSONB,
    "syllabusUrl" TEXT,
    "duration" TEXT,
    "durationHours" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountPrice" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "maxCapacity" INTEGER,
    "enrolledCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "isBestseller" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "certificateOffered" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_enrollments" (
    "id" SERIAL NOT NULL,
    "enrollmentNumber" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "source" "EnrollmentSource" NOT NULL DEFAULT 'STUDENT_SELF',
    "adminAssignedById" INTEGER,
    "durationWeeks" INTEGER,
    "durationMonths" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedEndDate" TIMESTAMP(3) NOT NULL,
    "actualEndDate" TIMESTAMP(3),
    "isExtended" BOOLEAN NOT NULL DEFAULT false,
    "extendedWeeks" INTEGER NOT NULL DEFAULT 0,
    "extendedUntil" TIMESTAMP(3),
    "lastExtensionReason" TEXT,
    "extensionHistory" JSONB,
    "progressPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grade" TEXT,
    "mentorName" TEXT,
    "mentorEmail" TEXT,
    "certificateIssued" BOOLEAN NOT NULL DEFAULT false,
    "certificateId" TEXT,
    "certificateIssuedAt" TIMESTAMP(3),
    "paymentStatus" "EnrollmentPaymentStatus" NOT NULL DEFAULT 'FREE',
    "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "paymentReference" TEXT,
    "adminNotes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" SERIAL NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "type" "TransactionType" NOT NULL DEFAULT 'PAYMENT',
    "status" "TransactionStatus" NOT NULL DEFAULT 'SUCCESS',
    "gateway" "PaymentGateway" NOT NULL DEFAULT 'MANUAL_ADMIN',
    "method" "PaymentMethod" NOT NULL DEFAULT 'UPI',
    "transactionReference" TEXT,
    "gatewayOrderId" TEXT,
    "gatewayPaymentId" TEXT,
    "gatewaySignature" TEXT,
    "gatewayResponse" JSONB,
    "recordedById" INTEGER,
    "notes" TEXT,
    "refundAmount" DOUBLE PRECISION DEFAULT 0,
    "refundReason" TEXT,
    "refundedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_userId_key" ON "student_profiles"("userId");

-- CreateIndex
CREATE INDEX "student_profiles_university_idx" ON "student_profiles"("university");

-- CreateIndex
CREATE INDEX "student_profiles_college_idx" ON "student_profiles"("college");

-- CreateIndex
CREATE INDEX "student_profiles_department_idx" ON "student_profiles"("department");

-- CreateIndex
CREATE INDEX "student_profiles_registrationNumber_idx" ON "student_profiles"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "program_categories_name_key" ON "program_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "program_categories_slug_key" ON "program_categories"("slug");

-- CreateIndex
CREATE INDEX "program_categories_isActive_idx" ON "program_categories"("isActive");

-- CreateIndex
CREATE INDEX "program_categories_sortOrder_idx" ON "program_categories"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slug_key" ON "programs"("slug");

-- CreateIndex
CREATE INDEX "programs_type_status_idx" ON "programs"("type", "status");

-- CreateIndex
CREATE INDEX "programs_categoryId_idx" ON "programs"("categoryId");

-- CreateIndex
CREATE INDEX "programs_isActive_idx" ON "programs"("isActive");

-- CreateIndex
CREATE INDEX "programs_isBestseller_idx" ON "programs"("isBestseller");

-- CreateIndex
CREATE INDEX "programs_isFeatured_idx" ON "programs"("isFeatured");

-- CreateIndex
CREATE INDEX "programs_createdAt_idx" ON "programs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "program_enrollments_enrollmentNumber_key" ON "program_enrollments"("enrollmentNumber");

-- CreateIndex
CREATE INDEX "program_enrollments_userId_idx" ON "program_enrollments"("userId");

-- CreateIndex
CREATE INDEX "program_enrollments_programId_idx" ON "program_enrollments"("programId");

-- CreateIndex
CREATE INDEX "program_enrollments_status_idx" ON "program_enrollments"("status");

-- CreateIndex
CREATE INDEX "program_enrollments_paymentStatus_idx" ON "program_enrollments"("paymentStatus");

-- CreateIndex
CREATE INDEX "program_enrollments_startDate_expectedEndDate_idx" ON "program_enrollments"("startDate", "expectedEndDate");

-- CreateIndex
CREATE INDEX "program_enrollments_extendedUntil_idx" ON "program_enrollments"("extendedUntil");

-- CreateIndex
CREATE INDEX "program_enrollments_createdAt_idx" ON "program_enrollments"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "program_enrollments_userId_programId_key" ON "program_enrollments"("userId", "programId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_receiptNumber_key" ON "payment_transactions"("receiptNumber");

-- CreateIndex
CREATE INDEX "payment_transactions_enrollmentId_idx" ON "payment_transactions"("enrollmentId");

-- CreateIndex
CREATE INDEX "payment_transactions_userId_idx" ON "payment_transactions"("userId");

-- CreateIndex
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions"("status");

-- CreateIndex
CREATE INDEX "payment_transactions_gateway_idx" ON "payment_transactions"("gateway");

-- CreateIndex
CREATE INDEX "payment_transactions_paidAt_idx" ON "payment_transactions"("paidAt");

-- CreateIndex
CREATE INDEX "payment_transactions_gatewayOrderId_idx" ON "payment_transactions"("gatewayOrderId");

-- CreateIndex
CREATE INDEX "payment_transactions_gatewayPaymentId_idx" ON "payment_transactions"("gatewayPaymentId");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "program_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_enrollments" ADD CONSTRAINT "program_enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_enrollments" ADD CONSTRAINT "program_enrollments_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_enrollments" ADD CONSTRAINT "program_enrollments_adminAssignedById_fkey" FOREIGN KEY ("adminAssignedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "program_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
