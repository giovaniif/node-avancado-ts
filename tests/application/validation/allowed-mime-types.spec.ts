import { InvalidMimeTypeError } from '@/application/errors/validation'
import { AllowedMimeTypes } from '@/application/validation'

describe('AllowedMimeTypes', () => {
  it('should return InvalidMimeTypeError if value is invalid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/jpg')

    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })

  it('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/png')

    const error = sut.validate()

    expect(error).toBe(undefined)
  })

  it('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpg')

    const error = sut.validate()

    expect(error).toBe(undefined)
  })

  it('should return undefined if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpeg')

    const error = sut.validate()

    expect(error).toBe(undefined)
  })
})
