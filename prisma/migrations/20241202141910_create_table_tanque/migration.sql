-- CreateTable
CREATE TABLE "tanque" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nomeTanque" TEXT,
    "largura" DECIMAL(65,30) NOT NULL,
    "profundidade" DECIMAL(65,30) NOT NULL,
    "comprimento" DECIMAL(65,30) NOT NULL,
    "quantPeixe" TEXT,
    "tipoPeixe" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tanque_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tanque" ADD CONSTRAINT "tanque_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
