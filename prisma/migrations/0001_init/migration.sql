-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateTable
CREATE TABLE "users" (
	"id" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"password" TEXT,
	"firstName" TEXT,
	"lastName" TEXT,
	"name" TEXT,
	"image" TEXT,
	"emailVerified" TIMESTAMPTZ,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"lastLogin" TIMESTAMPTZ,
	"lastLoginIp" TEXT,
	"lastLoginUserAgent" TEXT,
	"status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
	CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
	"id" TEXT NOT NULL,
	"userId" TEXT NOT NULL,
	"type" TEXT NOT NULL,
	"provider" TEXT NOT NULL,
	"providerAccountId" TEXT NOT NULL,
	"refresh_token" TEXT,
	"access_token" TEXT,
	"expires_at" INTEGER,
	"token_type" TEXT,
	"scope" TEXT,
	"id_token" TEXT,
	"session_state" TEXT,
	CONSTRAINT "accounts_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
	"id" TEXT NOT NULL,
	"sessionToken" TEXT NOT NULL,
	"userId" TEXT NOT NULL,
	"expires" TIMESTAMPTZ NOT NULL,
	CONSTRAINT "sessions_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification_tokens" (
	"identifier" TEXT NOT NULL,
	"token" TEXT NOT NULL,
	"expires" TIMESTAMPTZ NOT NULL
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
	"id" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"token" TEXT NOT NULL,
	"expires" TIMESTAMPTZ NOT NULL,
	"used" BOOLEAN NOT NULL DEFAULT FALSE,
	"createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts" ("provider", "providerAccountId");
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions" ("sessionToken");
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens" ("token");
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens" ("identifier", "token");
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens" ("token");