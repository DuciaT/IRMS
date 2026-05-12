export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  image?: string;
  allergens?: string[];
  customizations?: string[];
  isCombo?: boolean;
  comboItems?: string[];
  promotionId?: string;
}

export interface FormData {
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  allergens: string;
  customizations: string;
  isCombo: boolean;
  comboItems: string;
  image: string;
}
