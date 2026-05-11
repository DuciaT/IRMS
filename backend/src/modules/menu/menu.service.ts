import { Injectable, NotFoundException } from '@nestjs/common';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

@Injectable()
export class MenuService {
  private readonly items: MenuItem[] = [
    { id: 'P001', name: 'Nước suối 500ml', category: 'Đồ uống', price: 5000, stock: 100 },
    { id: 'P002', name: 'Bánh mì', category: 'Đồ ăn', price: 15000, stock: 50 },
    { id: 'P003', name: 'Cà phê đen', category: 'Đồ uống', price: 10000, stock: 80 },
    { id: 'P004', name: 'Áo phông', category: 'Hàng hóa', price: 50000, stock: 30 },
    { id: 'P005', name: 'Quần jeans', category: 'Hàng hóa', price: 150000, stock: 20 },
  ];

  getAllItems(): MenuItem[] {
    return this.items;
  }

  getItemById(id: string): MenuItem {
    const item = this.items.find((product) => product.id === id);
    if (!item) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return item;
  }
}
