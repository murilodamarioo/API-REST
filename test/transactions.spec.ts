import { cookie } from '@fastify/cookie';
import { it, expect, test, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { title } from 'process';

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  
  afterAll(async () => {
    await app.close()
  })
  
  it('user can create a new transaction', async () => {
    const response =  await request(app.server).post('/transactions').send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit'
    })
  
    expect(response.status).toBe(201)
  })

  it('should be able to list all transactions', async() => {
    const createTransactionResponse =  await request(app.server).post('/transactions').send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit'
    })

    const cookies = createTransactionResponse.get('Set-Cookie')

    if (cookies) {
      const listTransactionsResponse = await request(app.server).get('/transactions').set('Cookie', cookies).expect(200)

      expect(listTransactionsResponse.body.transactions).toEqual([
        expect.objectContaining({
          title: 'New transaction',
        amount: 5000
        })
      ])
    } else {
      expect(cookies).toBe(401)
    }
  })
})
 