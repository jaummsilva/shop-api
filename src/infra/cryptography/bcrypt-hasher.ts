import { compare, hash } from 'bcryptjs'

import { HashComparer } from '@/core/cryptography/hash-comparer'
import { HashGenerator } from '@/core/cryptography/hash-generator'

export class BcryptAdapter implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 6

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
