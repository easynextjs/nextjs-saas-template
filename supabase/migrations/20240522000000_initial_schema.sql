-- 역할 ENUM 타입 생성
CREATE TYPE user_role AS ENUM ('owner', 'guest');

-- 상품 상태 ENUM 타입 생성
CREATE TYPE product_status AS ENUM ('in_ready', 'sale', 'soldout', 'stop');

-- 사용자 테이블 생성
CREATE TABLE "user" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "passwordHash" VARCHAR(255) NOT NULL,
  "passwordSalt" VARCHAR(255) NOT NULL,
  "lastLoginAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 이메일 인덱스 생성
CREATE INDEX idx_user_email ON "user" ("email");

-- 워크스페이스 테이블 생성
CREATE TABLE "workspace" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "userId" BIGINT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 워크스페이스 사용자 테이블 생성
CREATE TABLE "workspace_user" (
  "id" BIGSERIAL PRIMARY KEY,
  "workspaceId" BIGINT NOT NULL REFERENCES "workspace"("id") ON DELETE CASCADE,
  "userId" BIGINT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "role" user_role NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE("workspaceId", "userId")
);

-- 상품 테이블 생성
CREATE TABLE "product" (
  "id" BIGSERIAL PRIMARY KEY,
  "workspaceId" BIGINT NOT NULL REFERENCES "workspace"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "imageUrl" TEXT,
  "createdUserId" BIGINT NOT NULL REFERENCES "user"("id") ON DELETE SET NULL,
  "status" product_status NOT NULL DEFAULT 'in_ready',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 상품명 인덱스 생성
CREATE INDEX idx_product_name ON "product" ("name");

-- updatedAt 값 자동 업데이트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 각 테이블에 updatedAt 트리거 적용
CREATE TRIGGER update_user_updated_at
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_updated_at
BEFORE UPDATE ON "workspace"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_user_updated_at
BEFORE UPDATE ON "workspace_user"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_updated_at
BEFORE UPDATE ON "product"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 