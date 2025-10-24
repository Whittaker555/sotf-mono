// tests/routes/userRouter.test.ts
import request from "supertest";
import express from "express";
import userRouter from "../../api/routes/user";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

jest.mock("@aws-sdk/lib-dynamodb", () => {
  const originalModule = jest.requireActual("@aws-sdk/lib-dynamodb");
  return {
    ...originalModule,
    // Mock DynamoDBDocumentClient's 'from' method so that "send" is a jest.fn()
    DynamoDBDocumentClient: {
      from: jest.fn(() => ({
        send: jest.fn().mockResolvedValue({}), // resolves to empty object
      })),
    },
  };
});

describe("userRouter", () => {
  let app: express.Express;

  beforeAll(() => {
    // Create a simple Express app for testing
    app = express();
    app.use(express.json()); // parse JSON bodies
    app.use("/", userRouter); // mount your router at root
  });

  it("POST / returns 400 and does NOT call DynamoDB if userId is missing", async () => {
    // Missing userId
    const invalidUserData = { playlistId: "playlistXYZ" };

    const res = await request(app).post("/").send(invalidUserData);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "User ID is required" });

    // Check that docClient.send was NOT called
    const docClientInstance = (DynamoDBDocumentClient.from as jest.Mock).mock
      .results[0].value;
    expect(docClientInstance.send).not.toHaveBeenCalled();
  });

  it("POST / returns 400 and does NOT call DynamoDB if playlistId is missing", async () => {
    // Missing userId
    const invalidUserData = { userId: "user123" };

    const res = await request(app).post("/").send(invalidUserData);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Playlist ID is required" });

    // Check that docClient.send was NOT called
    const docClientInstance = (DynamoDBDocumentClient.from as jest.Mock).mock
      .results[0].value;
    expect(docClientInstance.send).not.toHaveBeenCalled();
  });

  it("POST / should insert a user into DynamoDB", async () => {
    const userData = { userId: "user123", playlistId: "playlistXYZ" };

    const res = await request(app).post("/").send(userData);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(userData);

    // Optionally verify that docClient.send was called
    // Access the mock from the mocked 'DynamoDBDocumentClient.from'
    // The easiest is to re-import or reference it from the top-level mock
    const docClientInstance = (DynamoDBDocumentClient.from as jest.Mock).mock
      .results[0].value;
    expect(docClientInstance.send).toHaveBeenCalledTimes(1);
  });


  
  it("GET / should get the playlists for the user when they exist in the database", async () => {
    const fakeItems = [
      { userId: "user123", playlistId: "playlistA" },
      { userId: "user123", playlistId: "playlistB" },
    ];
    let docClientSendMock = (
      DynamoDBDocumentClient.from as jest.Mock
    ).mock.results[0].value.send;
    docClientSendMock.mockResolvedValueOnce({ Items: fakeItems });

    const res = await request(app).get("/user123");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeItems);

    // Check that docClient.send was called with a QueryCommand
    expect(docClientSendMock).toHaveBeenCalledTimes(1);
    expect(docClientSendMock.mock.calls[0][0].input).toMatchObject({
      TableName: "sotf_users",
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": "user123" },
    });
  });

  it("DELETE /:userId/:playlistId should delete the playlist for the user", async () => {
    const docClientSendMock = (
      DynamoDBDocumentClient.from as jest.Mock
    ).mock.results[0].value.send;

    const res = await request(app).delete("/user123/playlistXYZ");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: "user123", playlistId: "playlistXYZ" });

    expect(docClientSendMock).toHaveBeenCalledTimes(1);
    expect(docClientSendMock.mock.calls[0][0].input).toMatchObject({
      TableName: "sotf_users",
      Key: { userId: "user123", playlistId: "playlistXYZ" },
    });
  });
});
