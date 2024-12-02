-- CreateTable
CREATE TABLE "peixe" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tipo_peixe" TEXT NOT NULL,
    "quant_peixe" TEXT NOT NULL,
    "fase_criacao" TEXT NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "peixe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "peixe" ADD CONSTRAINT "peixe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
