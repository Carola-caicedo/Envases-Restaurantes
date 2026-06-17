-- CreateTable
CREATE TABLE "OrdenCompra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restauranteId" TEXT NOT NULL,
    "proveedorId" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OrdenCompra_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "Restaurante" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrdenCompra_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "ProveedorPerfil" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DetalleOrden" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ordenId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" REAL NOT NULL,
    CONSTRAINT "DetalleOrden_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "OrdenCompra" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DetalleOrden_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "ProductoCatalogo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Envase" (
    "qrCode" TEXT NOT NULL PRIMARY KEY,
    "productoId" TEXT NOT NULL,
    "restauranteId" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'INACTIVO',
    "usosActuales" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Envase_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "ProductoCatalogo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Envase_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "Restaurante" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
