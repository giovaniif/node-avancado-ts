import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  it('should create with empty initials when pictureUrl is provided', () => {
    const sut = new UserProfile('any_id')
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })
})
