export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
  customizations?: Record<string, string>;
  comboSelections?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  promotionId?: string;
  isCombo?: boolean;
  allergens?: string[];
  customizations?: string[];
  comboItems?: string[];
}
