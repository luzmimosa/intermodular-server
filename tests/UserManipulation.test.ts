 import request from 'supertest';

describe('user creation', () => {
    it ('should register an user by using the "/account/register" endpoint ', async () => {

        const userNumber = Math.round(Math.random() * 100000)
        const user = {
            username: "alpacaDePruebas" + userNumber,
            displayName: "Alpaca",
            biography: "Soy una alpaca preciosa UwU",
            email: "alpaca" + userNumber + "@gmail.com",
            password: "alpacontraseña"
        }

        const response = await request('https://localhost')
            .post('/account/register')
            .send(user)
            .set('Accept', 'application/json')
            .trustLocalhost(true)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(response.body.message).toBe("SUCCESS");

    })
})