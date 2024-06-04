export interface UpdateProfileBodyMultiPartsProps {
  name: { value: string }
  email: { value: string }
  password: { value: string }
  phone: { value: string }
  birthdate: { value: Date }
  photoPath: {
    value: string
    filename: string
    mimetype: string
    type: string
    toBuffer: () => Promise<Buffer>
  }
}
