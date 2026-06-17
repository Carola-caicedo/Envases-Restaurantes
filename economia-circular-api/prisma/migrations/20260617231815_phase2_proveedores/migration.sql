-- CreateTable
CREATE TABLE "ProveedorPerfil" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "nit" TEXT,
    "direccion" TEXT,
    "descripcion" TEXT,
    "logoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProveedorPerfil_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductoCatalogo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "proveedorId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "material" TEXT NOT NULL,
    "capacidadMl" INTEGER,
    "dimensiones" TEXT,
    "precioUnitario" REAL NOT NULL,
    "maxUsosEstimado" INTEGER NOT NULL,
    "imagenUrl" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductoCatalogo_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "ProveedorPerfil" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProveedorPerfil_usuarioId_key" ON "ProveedorPerfil"("usuarioId");
