import 'dotenv/config'

export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? ''
  },
  appPort: process.env.PORT ?? 3030,
  jwtSecret: process.env.JWT_SECRET ?? ''
}
