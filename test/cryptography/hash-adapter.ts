import { HashComparer } from '@/core/cryptography/hash-comparer'
import type { HashGenerator } from '@/core/cryptography/hash-generator'

export class HashAdapter implements HashComparer, HashGenerator {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hash')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const concatenated = plain.concat('-hash')

    return concatenated === hash
  }
}
