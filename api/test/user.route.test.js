import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

//before actions
beforeAll(async () => {
    try {
        await mongoose.connect(process.env.MONGO_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    }
});

//after actions
afterAll(async () => {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
});

//delete user data before test
beforeEach(async () => {
    await User.deleteMany({});

    //create user for testing
    await User.create({
        username: "dilu123",
        email: "dilu@example.com",
        password: bcryptjs.hashSync("ADWx2001@", 10),
        mobile: "0711234567",
        firstName: "Dilshan",
        lastName: "test",
        isAdmin: true
    });
});

//function for generate a jwt toen
const generateToken = (userId, isAdmin = false) => {
    return jwt.sign({ id: userId, isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe("GET /api/user/signout", () => {
    it("should sign out a user successfully", async () => {
        console.log("Running signout test: should sign out a user successfully");
        const res = await request(app)
            .get("/api/user/signout")
            .set('Cookie', ['access_token=testtoken']);

        console.log(res.body); // Debug the response body
        expect(res.status).toBe(200);
        expect(res.body).toBe('User has been signed out');
    });
});

describe("PUT /api/user/update/:id", () => {
    it("should update a user successfully", async () => {
        console.log("Running update test: should update a user successfully");

        //find the test user
        const testUser = await User.findOne({ email: "dilu@example.com" });
        const token = generateToken(testUser._id);

        const res = await request(app)
            .put(`/api/user/update/${testUser._id}`)
            .set('Authorization', `Bearer ${token}`) //add token for authentication
            .send({
                username: "updatedUserdilu",
                email: "updateddilu@example.com",
                firstName: "dilshan",
                lastName: "wicky",
                mobile: "0721234567"
            });

        console.log(res.body);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("username", "updatedUser");
        expect(res.body).toHaveProperty("email", "updated@example.com");
    });

    it("should return an error for unauthorized update", async () => {
        console.log("Running update test: should return an error for unauthorized update");

        // unauthorized access test
        const anotherUser = await User.create({
            username: "unauthorizedUser",
            email: "unauthorizeduser@gamil.com",
            password: bcryptjs.hashSync("ASDqwe123@!", 10),
            mobile: "0719007865",
            firstName: "unauthorized",
            lastName: "User"
        });

        const token = generateToken(anotherUser._id);

        const testUser = await User.findOne({ email: "dilu@example.com" });

        const res = await request(app)
            .put(`/api/user/update/${testUser._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: "unauthorizedUser",
                email: "unauthorizeduser@gamil.com"
            });

        console.log(res.body); // Debug the response body
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message", "You can update only your Account");
    });
});

describe("DELETE /api/user/delete/:id", () => {
    it("should delete a user successfully (admin)", async () => {
        console.log("Running delete test: should delete a user successfully (admin)");

        // Find the test user
        const testUser = await User.findOne({ email: "dilu@example.com" });
        const token = generateToken(testUser._id, true); //admin token

        const res = await request(app)
            .delete(`/api/user/delete/${testUser._id}`)
            .set('Authorization', `Bearer ${token}`); //add admin token

        console.log(res.body);
        expect(res.status).toBe(200);
        expect(res.body).toBe("User has been Deleted...");
    });

    it("should return an error for unauthorized delete (non-admin)", async () => {
        console.log("Running delete test: should return an error for unauthorized delete (non-admin)");

        //non-admin access
        const anotherUser = await User.create({
            username: "anotherUser",
            email: "another@example.com",
            password: bcryptjs.hashSync("ABC123@@@!", 10),
            mobile: "0716775362",
            firstName: "Another",
            lastName: "User"
        });

        const token = generateToken(anotherUser._id); //token for non-admin token

        const testUser = await User.findOne({ email: "dilu@example.com" });

        const res = await request(app)
            .delete(`/api/user/delete/${testUser._id}`)
            .set('Authorization', `Bearer ${token}`);

        console.log(res.body); // Debug the response body
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("message", "You are not allowed to delete this user");
    });
});