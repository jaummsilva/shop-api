import type { Order } from '@/domain/enterprise/order'

export class OrdersPresenter {
  static toHttp(order: Order) {
    return {
      id: order.id.toString(),
      totalPrice: order.totalPrice,
      userId: order.userId ? order.userId.toString() : null,
      userName: order.userName ?? null,
      orderItems: order.orderItems.map((orderItem) => ({
        id: orderItem.id.toString(),
        productId: orderItem.productId
          ? orderItem.productId.toString()
          : undefined,
        orderId: orderItem.orderId ? orderItem.orderId.toString() : undefined,
        quantity: orderItem.quantity,
        productPrice: orderItem.productPrice,
        productName: orderItem.productName,
        totalPrice: orderItem.totalPrice,
      })),
    }
  }
}
