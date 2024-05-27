import type { Cart } from '@/domain/enterprise/cart'
import type { CartItem } from '@/domain/enterprise/cart-item'

export interface CartsRepository {
  create(data: Cart): Promise<Cart>
  createCartItem(data: CartItem): Promise<boolean>
  save(data: Cart): Promise<Cart>
  findById(cartId: string): Promise<Cart | null>
  findCartItemByProductAndUser(
    userId: string,
    productId: string,
  ): Promise<CartItem | null>
  saveCartItem(data: CartItem): Promise<void>
  findOpenCartByUser(userId: string): Promise<Cart | null>
  clearItemsFromCart(userId: string): Promise<boolean>
  clearProductFromCart(userId: string, productId: string): Promise<boolean>
}
