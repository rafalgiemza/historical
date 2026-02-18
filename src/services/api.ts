import type { User, Post, Comment } from '../types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function fetchAllUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json() as Promise<User[]>;
}

export async function fetchPostsByUser(userId: number): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/posts?userId=${userId}`);
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  return res.json() as Promise<Post[]>;
}

export async function fetchCommentsByPostIds(postIds: number[]): Promise<Comment[]> {
  const results = await Promise.all(
    postIds.map(async (postId) => {
      const res = await fetch(`${BASE_URL}/comments?postId=${postId}`);
      if (!res.ok) throw new Error(`Failed to fetch comments: ${res.status}`);
      return res.json() as Promise<Comment[]>;
    }),
  );
  return results.flat();
}
