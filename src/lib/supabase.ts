import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Profile = {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  notifications_enabled: boolean;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
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