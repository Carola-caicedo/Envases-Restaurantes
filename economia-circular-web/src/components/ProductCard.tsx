import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button } from '@mui/material';

interface ProductCardProps {
  nombre: string;
  material: string;
  precioUnitario: number;
  maxUsosEstimado: number;
  imagenUrl?: string | null;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  nombre,
  material,
  precioUnitario,
  maxUsosEstimado,
  imagenUrl,
  onAddToCart,
}) => {
  const imageUrl = imagenUrl ? `http://localhost:3000${imagenUrl}` : 'https://via.placeholder.com/300x200?text=Sin+Imagen';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia component="img" height="200" image={imageUrl} alt={nombre} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" fontWeight="bold">
          {nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Material: {material}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vida útil: {maxUsosEstimado} usos
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            ${precioUnitario.toLocaleString()} COP
          </Typography>
          {onAddToCart && (
            <Button variant="contained" size="small" onClick={onAddToCart}>
              Añadir
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
