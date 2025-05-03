import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';


beforeAll(async () => {
    try {
        await mongoose.connect(process.env.MONGO_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    }
});


afterAll(async () => {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
});

//clean daatabase for test
beforeEach(async () => {
    await User.deleteMany({});

    // Create a test user for signin tests
    await User.create({
        username: "dilu123",
        email: "dilu@example.com",
        password: bcryptjs.hashSync("ADWx2001@", 10), // Hash password
        mobile: "0711234567",
        firstName: "Dilshan",
        lastName: "test"
    });
});

describe("POST /api/auth/signup", () => {
    it("should register a new user successfully", async () => {
        console.log("Running signup test: should register a new user successfully"); // Debug
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                username: "dilu1234",
                email: "dilu123@example.com",
                password: "ADWx2001@",
                mobile: "0721234567",
                firstName: "Dilshan",
                lastName: "test"
            });

        console.log(res.body);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "User created successfully");
    });

    it("should return an error for missing fields", async () => {
        console.log("Running signup test: should return an error for missing fields");
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                username: "",
                email: "",
                password: "",
                mobile: "",
                firstName: "",
                lastName: ""
            });

        console.log(res.body);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "All fields are required");
    });
});

describe("POST /api/auth/signin", () => {
    it("should login a user successfully", async () => {
        console.log("Running signin test: should login a user successfully");
        const res = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "dilu@example.com",
                password: "ADWx2001@"
            });

        console.log(res.body); // Debug the response body
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("username", "dilu123");
    });

    it("should return an error for incorrect credentials", async () => {
        console.log("Running signin test: should return an error for incorrect credentials"); // Debug
        const res = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "dilu@example.com",
                password: "WrongPassword"
            });

        console.log(res.body); // Debug the response body
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "Invalid credentials!");
    });

    it("should return an error for missing fields", async () => {
        console.log("Running signin test: should return an error for missing fields"); // Debug
        const res = await request(app)
            .post("/api/auth/signin")
            .send({
                email: "",
                password: ""
            });

        console.log(res.body); // Debug the response body
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "All fields are required");
    });
});