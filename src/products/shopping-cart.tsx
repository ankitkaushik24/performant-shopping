import { useState } from "react"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx"

interface CartItem {
  id: number
  name: string
  price: number
  discount: number
  quantity: number
}

const initialCartItems: CartItem[] = [
  { id: 1, name: "Leather Jacket", price: 199.99, discount: 10, quantity: 1 },
  { id: 2, name: "Denim Jeans", price: 59.99, discount: 0, quantity: 2 },
  { id: 3, name: "Sneakers", price: 89.99, discount: 5, quantity: 1 },
]

export function ShoppingCartComponent() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity >= 0) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const calculateFinalPrice = (item: CartItem) => {
    const discountedPrice = item.price * (1 - item.discount / 100)
    return (discountedPrice * item.quantity).toFixed(2)
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(calculateFinalPrice(item)), 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.discount}%</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>${calculateFinalPrice(item)}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-8 flex flex-col items-end">
            <p className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
            <div className="mt-4 space-x-4">
              <Button variant="outline" asChild>
                <Link href="/products">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <Button>Proceed to Checkout</Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Button variant="outline" asChild>
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}