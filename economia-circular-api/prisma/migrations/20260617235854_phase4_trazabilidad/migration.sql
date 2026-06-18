-- CreateTable
CREATE TABLE "TransaccionEnvase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "envaseQr" TEXT NOT NULL,
    "restauranteId" TEXT NOT NULL,
    "clienteId" TEXT,
    "tipoMovimiento" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observaciones" TEXT,
    CONSTRAINT "TransaccionEnvase_envaseQr_fkey" FOREIGN KEY ("envaseQr") REFERENCES "Envase" ("qrCode") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TransaccionEnvase_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "Restaurante" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TransaccionEnvase_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
