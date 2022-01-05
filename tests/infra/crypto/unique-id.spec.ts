import { UniqueId } from '@/infra/crypto'

describe('UniqueId', () => {
  it('should return correct key', () => {
    const sut = new UniqueId(new Date(2021, 9, 3, 10, 10, 10))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20211003101010')
  })

  it('should return correct key', () => {
    const sut = new UniqueId(new Date(2014, 2, 3, 8, 7, 5))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20140303080705')
  })
})
