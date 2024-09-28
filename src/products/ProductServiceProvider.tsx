import {
  useComputed,
  signal,
  computed,
  Signal,
  batch,
} from "@preact/signals-react";
import { CartItem, ProductType } from "./products.model";
import { createContext, PropsWithChildren, useContext, useState } from "react";

const calculateFinalPrice = (
  item: ProductType & { quantity: Signal<number> }
) => {
  const discountedPrice = item.price * (1 - item.discountPercentage / 100);
  return discountedPrice * item.quantity.value;
};

const useProductsProviderValue = (rawProducts: ProductType[]) => {
  const [products] = useState(() =>
    rawProducts.map((product) => {
      const quantity = signal(0);
      return {
        ...product,
        quantity,
        inCart: signal(false),
        finalPrice: computed(() =>
          calculateFinalPrice({ ...product, quantity }).toFixed(2)
        ),
      };
    })
  );

  const cartItems = useComputed<CartItem[]>(() =>
    products.filter((product) => product.inCart.value)
  );

  const totalPrice = useComputed(() =>
    cartItems.value
      .reduce((sum, item) => sum + parseFloat(item.finalPrice.value), 0)
      .toFixed(2)
  );
  const totalQuantity = useComputed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity.value, 0)
  );

  const addToCart = (item: CartItem) => {
    batch(() => {
      item.inCart.value = true;
      item.quantity.value++;
    });
  };

  const removeItem = (item: CartItem) => {
    batch(() => {
      item.inCart.value = false;
      item.quantity.value = 0;
    });
  };

  return {
    products,
    cartItems,
    totalPrice,
    totalQuantity,
    addToCart,
    removeItem,
  };
};

const ProductsServiceContext = createContext<
  ReturnType<typeof useProductsProviderValue>
>(null!);

export const useProductSerivce = () => {
  return useContext(ProductsServiceContext);
};

const ProductServiceProvider = ({
  products,
  children,
}: PropsWithChildren<{ products: ProductType[] }>) => {
  const contextValue = useProductsProviderValue(products);
  return (
    <ProductsServiceContext.Provider value={contextValue}>
      {children}
    </ProductsServiceContext.Provider>
  );
};

export default ProductServiceProvider;
