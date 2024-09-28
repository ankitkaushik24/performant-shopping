import { FC, useEffect, useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import axiosInstance from "@/lib/axiosInstance.ts";
import { ProductType } from "@/products/products.model.ts";
import ProductsContainer from "@/products/ProductsContainer.tsx";
import ProductServiceProvider from "./ProductServiceProvider";

// const products: Product[] = [
//   { id: 1, name: "Leather Jacket", price: 199.99, image: "/placeholder.svg?height=200&width=200" },
//   { id: 2, name: "Denim Jeans", price: 59.99, image: "/placeholder.svg?height=200&width=200" },
//   { id: 3, name: "Sneakers", price: 89.99, image: "/placeholder.svg?height=200&width=200" },
//   { id: 4, name: "T-Shirt", price: 24.99, image: "/placeholder.svg?height=200&width=200" },
//   { id: 5, name: "Sunglasses", price: 129.99, image: "/placeholder.svg?height=200&width=200" },
//   { id: 6, name: "Watch", price: 299.99, image: "/placeholder.svg?height=200&width=200" },
// ]

const ProductList: FC<{ products: ProductType[] }> = ({ products }) => {
  const [cart, setCart] = useState<ProductType[]>([]);

  const addToCart = (product: ProductType) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product List</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <ShoppingCart className="mr-2 h-5 w-5" />
          {cart.length} items
        </Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col justify-between">
            <CardHeader>
              <img
                src={product.thumbnail}
                alt={product.title}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-md"
              />
            </CardHeader>
            <CardContent>
              <CardTitle>{product.title}</CardTitle>
              <p className="text-2xl font-bold mt-2">
                ${product.price.toFixed(2)}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => addToCart(product)}>
                <Plus className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ProductLoader = () => {
  const [products, setProducts] = useState();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axiosInstance.get("/products");
      const data = await response.data;
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  if (products) {
    return (
      <ProductServiceProvider products={products}>
        <ProductsContainer />
      </ProductServiceProvider>
    );
  }

  return "Loading...";
};

export default ProductLoader;
