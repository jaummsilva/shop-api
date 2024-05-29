import type { Cart } from '@/domain/enterprise/cart'

export class CartsPresenter {
  static toHttp(cart: Cart) {
    return {
      id: cart.id.toString(),
      status: cart.status,
      userName: cart.userName ?? null,
      cartItems: cart.cartItems.map((cartItem) => ({
        id: cartItem.id.toString(),
        productId: cartItem.productId
          ? cartItem.productId.toString()
          : undefined,
        quantity: cartItem.quantity,
      })),
      totalItems: cart.totalItems ?? 0,
      totalPrice: cart.totalPrice ?? 0,
    }
  }
}
