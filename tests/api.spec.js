import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

test.describe('API-тесты для Restful-booker (CRUD операции)', () => {

  const baseURL = 'https://restful-booker.herokuapp.com'

  let bookingId = null
  let authToken = null

  test('Создание бронирования (POST /booking)', async ({ request }) => {
    const bookingData = {
      firstname: 'Jane',
      lastname: 'Doe',
      totalprice: 200,
      depositpaid: false,
      bookingdates: {
        checkin: '2024-12-15',
        checkout: '2024-12-20'
      },
      additionalneeds: 'Breakfast'
    }

    const response = await request.post(`${baseURL}/booking`, {
      data: bookingData
    })

    console.log(`Статус-код ответа CREATE: ${response.status()}`)
    expect(response.status()).toBe(200)

    const responseBody = await response.json()
    console.log('Тело ответа CREATE:', responseBody)
    expect(responseBody).toHaveProperty('bookingid')
    bookingId = responseBody.bookingid
    console.log(`bookingId: ${bookingId}`)

    expect(responseBody.booking.firstname).toBe(bookingData.firstname)
    expect(responseBody.booking.lastname).toBe(bookingData.lastname)
    expect(responseBody.booking.totalprice).toBe(bookingData.totalprice)
    expect(responseBody.booking.depositpaid).toBe(bookingData.depositpaid)
    expect(responseBody.booking.bookingdates.checkin).toBe(bookingData.bookingdates.checkin)
    expect(responseBody.booking.bookingdates.checkout).toBe(bookingData.bookingdates.checkout)
    expect(responseBody.booking.additionalneeds).toBe(bookingData.additionalneeds)
  })

  test('Получение информации о бронировании (GET /booking/{id})', async ({ request }) => {
    const testBookingId = bookingId
    console.log(`Используемый bookingId для GET: ${testBookingId}`)

    const response = await request.get(`${baseURL}/booking/${testBookingId}`)

    console.log(`Статус-код ответа GET: ${response.status()}`)
    expect(response.status()).toBe(200)

    const responseBody = await response.json()
    console.log('Тело ответа GET:', responseBody)
    
    expect(responseBody.firstname).toBe('Jane')
    expect(responseBody.lastname).toBe('Doe')
    expect(responseBody.totalprice).toBe(200)
    expect(responseBody.depositpaid).toBe(false)
  })

  test('Обновление бронирования (PUT /booking/{id})', async ({ request }) => {
    const authResponse = await request.post(`${baseURL}/auth`, {
      data: {
        username: 'admin',
        password: 'password123'
      }
    })

    console.log(`Статус-код авторизации: ${authResponse.status()}`)
    expect(authResponse.status()).toBe(200)

    const authBody = await authResponse.json()
    console.log('Токен авторизации:', authBody.token)
    authToken = authBody.token

    const testBookingId = bookingId
    console.log(`Используемый bookingId для PUT: ${testBookingId}`)

    const updateData = {
      firstname: 'James',
      lastname: 'Brown',
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: '2018-01-01',
        checkout: '2019-01-01'
      },
      additionalneeds: 'Museum'
    }

    const response = await request.put(`${baseURL}/booking/${testBookingId}`, {
      data: updateData,
      headers: {
        'Cookie': `token=${authToken}`
      }
    })

    console.log(`Статус-код ответа PUT: ${response.status()}`)
    expect(response.status()).toBe(200)

    const responseBody = await response.json()
    console.log('Тело ответа PUT:', responseBody)
    
    expect(responseBody.firstname).toBe(updateData.firstname)
    expect(responseBody.lastname).toBe(updateData.lastname)
    expect(responseBody.totalprice).toBe(updateData.totalprice)
    expect(responseBody.depositpaid).toBe(updateData.depositpaid)
    expect(responseBody.bookingdates.checkin).toBe(updateData.bookingdates.checkin)
    expect(responseBody.bookingdates.checkout).toBe(updateData.bookingdates.checkout)
    expect(responseBody.additionalneeds).toBe(updateData.additionalneeds)
  })

  test('Удаление бронирования (DELETE /booking/{id})', async ({ request }) => {
    const testBookingId = bookingId
    console.log(`Используемый bookingId для DELETE: ${testBookingId}`)

    if (!authToken) {
      const authResponse = await request.post(`${baseURL}/auth`, {
        data: {
          username: 'admin',
          password: 'password123'
        }
      })
      const authBody = await authResponse.json()
      authToken = authBody.token
    }

    const response = await request.delete(`${baseURL}/booking/${testBookingId}`, {
      headers: {
        'Cookie': `token=${authToken}`
      }
    })

    console.log(`Статус-код ответа DELETE: ${response.status()}`)
    expect(response.status()).toBe(201)
    console.log('Бронирование успешно удалено!')

    const getAfterDelete = await request.get(`${baseURL}/booking/${testBookingId}`)
    console.log(`Статус-код GET после удаления: ${getAfterDelete.status()}`)
    
    expect(getAfterDelete.status()).toBe(404)
    console.log('Подтверждено: бронирование не найдено (404)')
  })
})