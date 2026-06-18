import { User, Product, Order, Cart, CartItem, Course, Category } from "@prisma/client";

export type { User, Product, Order, Cart, CartItem, Course, Category };

export type ProductWithCategory = Product & {
  category: Category | null;
};

export type CartWithItems = Cart & {
  items: (CartItem & {
    product: Product;
  })[];
};

export type OrderWithItems = Order & {
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
  }[];
};

export interface PaystackConfig {
  email: string;
  amount: number; // in kobo
  ref: string;
  publicKey: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  metadata?: Record<string, any>;
}
