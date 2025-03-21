import { Global, Module } from '@nestjs/common'

import { Encrypter } from '@/domain/catechists/cryptography/encrypter'
import { HashComparer } from '@/domain/catechists/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/catechists/cryptography/hash-generator'

import { JwtEncrypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'

@Global()
@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
