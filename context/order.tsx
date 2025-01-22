"use Client";
import { createContext, useState, useContext, ReactNode } from "react";

export const OrderContext = createContext<any>(undefined); //<any> indicating the context can hold any type of value.

interface OrderProviderProps {
  children: ReactNode;
}
export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <OrderContext.Provider
      value={{ cartItems, setCartItems, isSidebarOpen, setIsSidebarOpen }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
