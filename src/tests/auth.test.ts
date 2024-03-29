import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";

let app: Express;
const user = {
  email: "test_auth_user@test.com",
  password: "1234567890",
  user_name: "test_auth_user",
}

beforeAll(async () => {
  app = await initApp();
  //////////////console.log("beforeAll");
  await User.deleteMany({ 'email': user.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string

describe("Auth tests", () => {
  test("Test Register", async () => {
    //////////////console.log("Test Register");
    const response = await request(app)
      .post("/auth/register")
      .send(user);
    expect(response.statusCode).toBe(201);
    // expect(response.body.user_name).toBe(user.user_name);
    // //////////////console.log("response.body: " + response.body.password);
  });

  // test("Test get a randomphoto", async () => {
  //   const response = await request(app)
  //     .get("/auth/randomphoto")
  //     .send();
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.url).toBeDefined();
  // }
  test("Test Register exist email", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(user);
    expect(response.statusCode).toBe(406);
  });

  test("Test Register missing password", async () => {
    const response = await request(app)
      .post("/auth/register").send({
        email: "test@test.com",
      });
    expect(response.statusCode).toBe(400);
  });
/*
*/
  test ("Test Register missing email", async () => {
    const response = await request(app)
      .post("/auth/register").send({
        password : "1234567890"
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test Incorrect Email", async () => {
    const response = await request(app)
      .post("/auth/login").send({
        email: "1.com",
        password: "1234567890",
        user_name: "test_auth_user"
      });
    expect(response.statusCode).toBe(401);
  });
/*
*/
  test ("Test Login missing email", async () => {
    const response = await request(app)
      .post("/auth/login").send({user_name: "test_auth_user", password: "1234567890"});
    expect(response.statusCode).toBe(400);
  });

  test("Test Login", async () => {
    const response = await request(app)
      .post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
    //////console.log("Test Login!!!!!!!");
    //////console.log(JSON.stringify(response.body, null, 2));
    // expect(response.body.user_name).toBe(user.user_name);
  });

  test("Test forbidden access without token", async () => {
    const response = await request(app).get("/course");
    expect(response.statusCode).toBe(401);
  });

  test("Test access with valid token", async () => {
    const response = await request(app)
      .get("/course")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });

  test("Test access with invalid token", async () => {
    const response = await request(app)
      .get("/course")
      .set("Authorization", "JWT 1" + accessToken);
    expect(response.statusCode).toBe(401);
  });

  jest.setTimeout(10000);

  test("Test access after timeout of token", async () => {
    await new Promise(resolve => setTimeout(() => resolve("done"), 5000));

    const response = await request(app)
      .get("/course")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).not.toBe(200);
  });

  test("Test refresh token", async () => {
    // await new Promise(resolve => setTimeout(() => resolve("done"), 5000));
    //////console.log("Test refresh token!!!!!!!");
    ////console.log("refreshToken: " + refreshToken);
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).toBe(200);
    ////console.log("response.body: " + JSON.stringify(response.body, null, 2));
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    // //////console.log("response.body.accessToken: " + response.body.accessToken);
    // //////console.log("response.body.refreshToken[]: " + JSON.stringify(response.body.refreshToken, null, 2));
    const newAccessToken = response.body.accessToken;
    newRefreshToken = response.body.refreshToken;

    const response2 = await request(app)
      .get("/course")
      .set("Authorization", "JWT " + newAccessToken);
    expect(response2.statusCode).toBe(200);
  });

  // test("Test double use of refresh token", async () => {
  //   const response = await request(app)
  //     .get("/auth/refresh")
  //     .set("Authorization", "JWT " + refreshToken)
  //     .send();
  //   expect(response.statusCode).not.toBe(200);

  //   //verify that the new token is not valid as well
  //   const response1 = await request(app)
  //     .get("/auth/refresh")
  //     .set("Authorization", "JWT " + newRefreshToken)
  //     .send();
  //   expect(response1.statusCode).not.toBe(200);
  // });
  test("Test logout with null refreshToken or error in jwt", async () => {
    const nulltoken = null
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "JWT " + nulltoken)
      .send();
    expect(response.statusCode).toBe(400);
  });

  test("Test Logout with the refreshToken", async () => {
    ////console.log("Test Logout with the refreshToken!!!");
    ////console.log("newRefreshToken: " + newRefreshToken);
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "JWT " + newRefreshToken)
      .send();
    newRefreshToken = null;
    // ////console.log("response.body: " + JSON.stringify(response.body, null, 2));
    expect(response.statusCode).toBe(200);
    ////console.log("try course!!!!!!")
    const response2 = await request(app)
      .get("/course")
      .set("Authorization", "JWT " + newRefreshToken);
    expect(response2.statusCode).toBe(401);
  });
  /*
  */
});
