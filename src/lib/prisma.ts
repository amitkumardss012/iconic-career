import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

export { PrismaClient, Prisma } from "../../generated/prisma/client.js";
export type {
  User,
  StudentProfile,
  Gender,
  DegreeLevel,
  ProgramCategory,
  Program,
  ProgramType,
  ProgramStatus,
  ProgramLevel,
  DeliveryMode,
  ProgramEnrollment,
  EnrollmentStatus,
  EnrollmentSource,
  EnrollmentPaymentStatus,
  PaymentTransaction,
  PaymentGateway,
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from "../../generated/prisma/client"