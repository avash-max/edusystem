const request = require ("supertest")
require("dotenv").config();
const jwt = require('jsonwebtoken');

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;

describe(`register user`, () => {
    
    //Success Case: Registering an Individual
    it(`should create a new individual user successfully`, async () => {
        const uniqueEmail = `indiv${Date.now()}@test.com`;
        const res = await request(BASE_URL)
            .post(`/api/auth/register`)
            .send({
                username: 'johndoe',
                email: uniqueEmail,
                password: 'password123',
                role: 'individual',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('User added successfully');
        expect(res.body.user.email).toBe(uniqueEmail);
    });

    // Error Case: Missing Fields
    it(`should return 400 if required fields are missing`, async () => {
        const res = await request(BASE_URL)
            .post(`/api/auth/register`)
            .send({
                username: 'incomplete_user'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("please fill all the fields");
    });

    // Error Case: Duplicate Email
    it(`should return 400 if the email already exists`, async () => {
        const duplicateEmail = 'existing@test.com';
        
        // Ensure the user exists (or assume it does from setup)
        const res = await request(BASE_URL)
            .post(`/api/auth/register`)
            .send({
                username: 'newuser',
                email: duplicateEmail,
                password: 'password123',
                role: 'individual'
            });

        expect(res.statusCode).toBe(400);
        // Note: Your controller uses ${username} in the message for email exists
        expect(res.body.message).toContain('already exists');
    });

    //Logic Case: Registering an Organization
    it(`should create an organization user and handle orgDetails`, async () => {
        const uniqueEmail = `org${Date.now()}@company.com`;
        const res = await request(BASE_URL)
            .post(`/api/auth/register`)
            .send({
                username: 'techcorp',
                email: uniqueEmail,
                password: 'password123',
                role: 'organization',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.user.username).toBe('techcorp');
    });
});



describe(`login user`, () => {

    // 1. Success Case
    it(`should login a user successfully with valid credentials`, async () => {
        const res = await request(BASE_URL)
            .post(`/api/auth/login`)
            .send({
                email: 'abc@mailinator.com', // Ensure this user exists and isVerified: true in your DB
                password: 'Pa$$w0rd!'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('login successful');
        expect(res.body).toHaveProperty('token');
    });

    // 2. Error Case: Missing Fields
    it(`should return 400 if email or password is empty`, async () => {
        const res = await request(BASE_URL)
            .post(`/api/auth/login`)
            .send({
                email: '',
                password: 'somepassword'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("email or password cannot be empty");
    });

    // 3. Error Case: Unverified User
    it(`should return 403 if the user email is not verified`, async () => {
        // This assumes 'unverified@test.com' exists in DB with isVerified: false
        const res = await request(BASE_URL)
            .post(`/api/auth/login`)
            .send({
                email: 'unique1769503721990@gmail.com',
                password: 'Pa$$w0rd!'
            });

        expect(res.statusCode).toBe(403);
        expect(res.body.message).toContain("isn't verified");
    });

    // 4. Error Case: Wrong Password
    it(`should return 400 if the password does not match`, async () => {
        const res = await request(BASE_URL)
            .post(`/api/auth/login`)
            .send({
                email: 'abc@mailinator.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("email or password didn't match");
    });
});


describe(`forgotPassword`, () => {
    it(`should send a reset email for a registered user`, async () => {
        const res = await request(BASE_URL)
            .post(`/api/auth/forgot-password`)
            .send({ email: 'abc@mailinator.com' }); // Ensure this exists in DB
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("email sent, please verify yourself");
    });

    it(`should return 400 for an unregistered email`, async () => {
        const res = await request(BASE_URL)
            .post(`/api/auth/forgot-password`)
            .send({ email: 'nonexistent@random.com' });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("unregistered email");
    });
});


describe(`deleteUser`, () => {
    let testToken;

    beforeAll(() => {
        testToken = jwt.sign(
            { id: 87, role: 'individual' },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
    });

    it(`should fail if the password provided is incorrect`, async () => {
        const res = await request(BASE_URL)
            .delete(`/api/auth/delete-user`)
            .set('Authorization', `Bearer ${testToken}`)
            .send({ password: 'wrongpassword' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Password didn't match");
    });

    it(`should delete account if password matches`, async () => {
        const res = await request(BASE_URL)
            .delete(`/api/auth/delete-user`)
            .set('Authorization', `Bearer ${testToken}`)
            .send({ password: 'abc' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toContain("Account deleted successfully");
    });
});