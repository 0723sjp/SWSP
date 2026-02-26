export interface Product {
  id: string;
  name: string;
  category: 'Tea' | 'Accessories' | 'Dessert' | 'Tea Cocktail' | 'Cocktail' | 'Chaskey' | 'Blind Course' | 'Tasting Course';
  price: number;
  description: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}
