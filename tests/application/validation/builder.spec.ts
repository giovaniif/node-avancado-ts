import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer, RequiredString, ValidationBuilder } from '@/application/validation'

describe('ValidationBuilder', () => {
  it('should return RequiredString', () => {
    const validators = ValidationBuilder.of({ value: 'any_value' }).required().build()

    expect(validators).toEqual([new RequiredString('any_value')])
  })

  it('should return RequiredBuffer', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder.of({ value: buffer }).required().build()

    expect(validators).toEqual([new RequiredBuffer(buffer)])
  })

  it('should return Required', () => {
    const value = { any: 'any' }

    const validators = ValidationBuilder.of({ value }).required().build()

    expect(validators).toEqual([new Required(value)])
  })

  it('should return Required', () => {
    const buffer = Buffer.from('any_buffer')
    const value = { buffer }

    const validators = ValidationBuilder.of({ value }).required().build()

    expect(validators).toEqual([new Required({ buffer }), new RequiredBuffer(buffer)])
  })

  it('should return correct Image validators', () => {
    const buffer = Buffer.from('any_buffer')
    const value = { buffer }

    const validators = ValidationBuilder
      .of({ value })
      .image({ allowed: ['png'], maxSizeInMb: 5 })
      .build()

    expect(validators).toEqual([new MaxFileSize(5, buffer)])
  })

  it('should return correct Image validators', () => {
    const value = { mimeType: 'image/png' }

    const validators = ValidationBuilder
      .of({ value })
      .image({ allowed: ['png'], maxSizeInMb: 5 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['png'], 'image/png')])
  })

  it('should return correct Image validators', () => {
    const buffer = Buffer.from('any_buffer')
    const value = { mimeType: 'image/png', buffer }

    const validators = ValidationBuilder
      .of({ value })
      .image({ allowed: ['png'], maxSizeInMb: 5 })
      .build()

    expect(validators).toEqual([new AllowedMimeTypes(['png'], 'image/png'), new MaxFileSize(5, buffer)])
  })
})
