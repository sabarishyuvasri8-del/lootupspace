'use client';

import { useState, useEffect } from 'react';
import { SizeTier } from '@lootupspace/shared';

interface CartState {
  cartItems: any[];
  commitmentMonths: 3 | 6 | 12;
  selectedAddressId: string | null;
  priorityPickup: boolean;
  packingMaterials: boolean;
  insuranceTierId: string;
  couponCode: string;
  
  addItemToCart: (item: any) => void;
  removeItemFromCart: (itemId: string) => void;
  clearCart: () => void;
  setCommitmentMonths: (months: 3 | 6 | 12) => void;
  setSelectedAddressId: (addressId: string) => void;
  setPriorityPickup: (enabled: boolean) => void;
  setPackingMaterials: (enabled: boolean) => void;
  setInsuranceTierId: (tierId: string) => void;
  setCouponCode: (code: string) => void;
}

// In-memory simple hook state without extra dependencies

export function usePickupCart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [commitmentMonths, setCommitmentMonths] = useState<3 | 6 | 12>(3);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr_001');
  const [priorityPickup, setPriorityPickup] = useState<boolean>(false);
  const [packingMaterials, setPackingMaterials] = useState<boolean>(false);
  const [insuranceTierId, setInsuranceTierId] = useState<string>('BASIC');
  const [couponCode, setCouponCode] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('lootup_cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveItems = (items: any[]) => {
    setCartItems(items);
    localStorage.setItem('lootup_cart', JSON.stringify(items));
  };

  const addItemToCart = (item: any) => {
    const exists = cartItems.some(i => i.id === item.id);
    if (!exists) {
      saveItems([...cartItems, item]);
    }
  };

  const removeItemFromCart = (itemId: string) => {
    saveItems(cartItems.filter(i => i.id !== itemId));
  };

  const clearCart = () => {
    saveItems([]);
  };

  return {
    cartItems,
    commitmentMonths,
    selectedAddressId,
    priorityPickup,
    packingMaterials,
    insuranceTierId,
    couponCode,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    setCommitmentMonths,
    setSelectedAddressId,
    setPriorityPickup,
    setPackingMaterials,
    setInsuranceTierId,
    setCouponCode
  };
}
