import { StatusCart } from '@/domain/enterprise/cart'

export function mapPrismaStatusToDomainStatus(
  prismaStatus: string,
): StatusCart {
  switch (prismaStatus) {
    case 'ABERTO':
      return StatusCart.ABERTO
    case 'FECHADO':
      return StatusCart.FECHADO
    default:
      throw new Error(`Unknown status: ${prismaStatus}`)
  }
}
