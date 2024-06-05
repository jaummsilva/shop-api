import { Order } from '@/domain/enterprise/order'

export class OrdersPresenter {
  static toHttp(order: Order) {
    return {
      id: order.id.toString(),
      totalPrice: order.totalPrice,
      userId: order.userId ? order.userId.toString() : null,
      userName: order.userName ?? null,
      createdAt: order.createdAt,
      orderItems: order.orderItems.map((orderItem) => {
        const principalImage = orderItem.productImages.find(
          (image) => image.isPrincipal,
        )

        return {
          id: orderItem.id.toString(),
          productId: orderItem.productId
            ? orderItem.productId.toString()
            : undefined,
          orderId: orderItem.orderId ? orderItem.orderId.toString() : undefined,
          quantity: orderItem.quantity,
          productPrice: orderItem.productPrice,
          productName: orderItem.productName,
          productImageUrl: principalImage
            ? `/product/${orderItem.productId!.toString()}/get-image/principal/${principalImage.imageFakeName}`
            : undefined,
          totalPrice: orderItem.totalPrice,
        }
      }),
    }
  }
}
