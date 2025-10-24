import { Router, Request, Response } from "express";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const router = Router();
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);
interface PlaylistItem {
  playlistId: {
    S: string;
  };
  userId: {
    S: string;
  };
}
router.post("/", async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);
    const { userId, playlistId } = req.body;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }
    if (!playlistId) {
      res.status(400).json({ error: "Playlist ID is required" });
      return;
    }

    const newItem = { userId, playlistId };

    const command = new PutCommand({
      TableName: "sotf_users",
      Item: newItem,
    });

    await docClient.send(command);
    res.status(200).json(newItem);
  } catch (error) {
    console.error("Error inserting item into DynamoDB:", error);
    res.status(500).json({ error: "Failed to insert user" });
  }
});

router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    // Example: store user playlists with partition key = userId
    const command = new QueryCommand({
      TableName: "sotf_users",
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: {
        ":uid": { S: userId }, // The low-level client expects typed attributes
      }
    });


    const dbResult = await docClient.send(command);
    const items = dbResult.Items || [] as PlaylistItem[]; // e.g. list of playlists

    // Return the found items
    res.status(200).json(items.map(x => x.playlistId.S));
  } catch (error) {
    console.error("Error fetching user playlists:", error);
    res.status(500).json({ error: "Failed to fetch user playlists" });
  }
});

router.delete(
  "/:userId/:playlistId",
  async (req: Request, res: Response) => {
    const { userId, playlistId } = req.params;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }
    if (!playlistId) {
      res.status(400).json({ error: "Playlist ID is required" });
      return;
    }

    try {
      const command = new DeleteCommand({
        TableName: "sotf_users",
        Key: { userId, playlistId },
      });
      await docClient.send(command);
      res.status(200).json({ userId, playlistId });
    } catch (error) {
      console.error("Error deleting user playlist:", error);
      res.status(500).json({ error: "Failed to delete user playlist" });
    }
  }
);

export default router;
