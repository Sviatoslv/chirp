import type { User } from "@clerk/nextjs/dist/api";
export const adjustUserForClient = (user: User) => ({
  id: user.id,
  username: user.username,
  profileImageUrl: user.profileImageUrl,
});
