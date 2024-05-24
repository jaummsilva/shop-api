export interface ProductRegisterBodyMultiPartsProps {
  name: { value: string }
  description?: { value: string }
  price: { value: number }
  photoPrincipal: {
    value: string
    filename: string
    mimetype: string
    type: string
    toBuffer: () => Promise<Buffer>
  }
  photos0?: {
    value: string
    filename: string
    mimetype: string
    type: string
    toBuffer: () => Promise<Buffer>
  }
  photos1?: {
    value: string
    filename: string
    mimetype: string
    type: string
    toBuffer: () => Promise<Buffer>
  }
  photos2?: {
    value: string
    filename: string
    mimetype: string
    type: string
    toBuffer: () => Promise<Buffer>
  }
}
