export interface UpdateBodyMultiPartsProps {
  userId: { value: string }
  name: { value: string }
  email: { value: string }
  password: { value: string }
  role: { value: 'ADMIN' | 'MEMBER' }
  phone: { value: string }
  status: { value: 'S' | 'N' }
  birthdate: { value: Date }
  photoPath: {
    value: string
    filename: string
    mimetype: string
    type: string
    toBuffer: () => Promise<Buffer>
  }
}
