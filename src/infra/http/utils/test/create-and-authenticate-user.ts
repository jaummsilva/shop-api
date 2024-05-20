import request from 'supertest'

import App from '@/main'

export async function createAndAuthenticateUser(app: App) {
  await request(app.instance.server).post('/user').send({
    name: 'TESTE USER',
    email: 'teste@gmail.com',
    password: '123456',
    role: 'ADMIN',
  })

  const authResponse = await request(app.instance.server)
    .post('/session')
    .send({
      email: 'teste@gmail.com',
      password: '123456',
    })

  const { token } = authResponse.body

  return token
}
