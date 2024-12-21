import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oxrirnfenscjtnoygrgx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cmlybmZlbnNjanRub3lncmd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDMzMzUsImV4cCI6MjA1MDE3OTMzNX0.OADCG9-juALDZrZWpgn5EgnX1aOP_FfN8DnmxyBiIWg';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Profile = {
  id: string;  // Changed to use 'id' as the primary identifier
  username: string;
  avatar_url?: string;
  bio?: string;
  notifications_enabled: boolean;
  created_at?: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  published: boolean;
};

export type Comment = {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  parent_id?: string;
  created_at: string;
};

export type Follow = {
  follower_id: string;
  following_id: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: 'new_post' | 'new_comment' | 'new_follower';
  actor_id: string;
  post_id?: string;
  comment_id?: string;
  read: boolean;
  created_at: string;
};
