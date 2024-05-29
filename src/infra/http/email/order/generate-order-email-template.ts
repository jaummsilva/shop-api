import type { Order } from '@/domain/enterprise/order'

export function generateOrderEmailTemplate(order: Order) {
  // Função para formatar a data
  function formatDate(date: Date) {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2) // Usando os últimos dois dígitos do ano
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  // Formatando a data do pedido
  const formattedDate = formatDate(order.createdAt ?? new Date())

  // Construindo o template HTML
  const template = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <div style="border-bottom: 1px solid #ddd; padding-bottom: 10px;">
        <h2 style="margin-bottom: 10px;">Confirmação de Pedido</h2>
        <p>Usuário do pedido: ${order.userName ?? 'Cliente'}!</p>
        <p><strong>ID do Pedido:</strong> ${order.id}</p>
        <p><strong>Data do Pedido:</strong> ${formattedDate}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantidade</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Preço</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems
            .map(
              (item) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">R$ ${item.totalPrice.toFixed(2).replace('.', ',')}</td>
              </tr>
            `,
            )
            .join('')}
        </tbody>
      </table>

      <div style="margin-top: 20px;">
        <h3><strong>Total:</strong> R$ ${order.totalPrice.toFixed(2).replace('.', ',')}</h3>
        <p>Atenciosamente,<br>Equipe de Vendas</p>
      </div>
    </div>
  `

  return template
}
