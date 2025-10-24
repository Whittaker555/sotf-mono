type User = {
  userId: string;
  spotifyAccessToken: string;
};

const getUsersPlaylists = async (): Promise<User[]> => {
  // Query from DynamoDB table with users
  
};
