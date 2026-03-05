import { useState, useEffect, useRef } from 'preact/hooks';
import type { User, Post, Comment, AsyncState } from '../types';
import { fetchPostsByUser, fetchCommentsByPostIds } from '../services/api';

interface DrawerProps {
  user: User | null;
  onClose: () => void;
}

type Tab = 'posts' | 'comments';

export function Drawer({ user, onClose }: DrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [posts, setPosts] = useState<AsyncState<Post[]>>({ data: null, loading: false, error: null });
  const [comments, setComments] = useState<AsyncState<Comment[]>>({
    data: null,
    loading: false,
    error: null,
  });

  // refs to avoid duplicate fetches (stores the userId for which data was loaded)
  const postsLoadedFor = useRef<number | null>(null);
  const commentsLoadedFor = useRef<number | null>(null);

  // Reset when selected user changes
  useEffect(() => {
    postsLoadedFor.current = null;
    commentsLoadedFor.current = null;
    setPosts({ data: null, loading: false, error: null });
    setComments({ data: null, loading: false, error: null });
    setActiveTab('posts');
  }, [user?.id]);

  // Lazy-load posts when Posts tab is active
  useEffect(() => {
    if (!user || activeTab !== 'posts') return;
    if (postsLoadedFor.current === user.id) return;

    postsLoadedFor.current = user.id;
    setPosts({ data: null, loading: true, error: null });

    (async () => {
      try {
        const data = await fetchPostsByUser(user.id);
        setPosts({ data, loading: false, error: null });
      } catch (err) {
        postsLoadedFor.current = null; // allow retry
        setPosts({ data: null, loading: false, error: (err as Error).message });
      }
    })();
  }, [user?.id, activeTab]);

  // Lazy-load comments when Comments tab is active
  useEffect(() => {
    if (!user || activeTab !== 'comments') return;
    if (commentsLoadedFor.current === user.id) return;

    commentsLoadedFor.current = user.id;
    setComments({ data: null, loading: true, error: null });

    (async () => {
      try {
        const userPosts = await fetchPostsByUser(user.id);
        const postIds = userPosts.map((p) => p.id);
        const data = await fetchCommentsByPostIds(postIds);
        setComments({ data, loading: false, error: null });
      } catch (err) {
        commentsLoadedFor.current = null; // allow retry
        setComments({ data: null, loading: false, error: (err as Error).message });
      }
    })();
  }, [user?.id, activeTab]);

  const isOpen = user !== null;

  return (
    <>
      <div
        class={`drawer-backdrop${isOpen ? ' drawer-backdrop--visible' : ''}`}
        onClick={onClose}
      />
      <aside class={`drawer${isOpen ? ' drawer--open' : ''}`}>
        {user && (
          <>
            <div class="drawer-header">
              <div class="drawer-user-info">
                <h2 class="drawer-user-name">{user.name}</h2>
                <p class="drawer-user-email">{user.email}</p>
                <p class="drawer-user-company">{user.company.name}</p>
              </div>
              <button class="drawer-close" onClick={onClose} aria-label="Zamknij">
                ×
              </button>
            </div>

            <div class="drawer-tabs">
              <button
                class={`tab-btn${activeTab === 'posts' ? ' tab-btn--active' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                Posts
              </button>
              <button
                class={`tab-btn${activeTab === 'comments' ? ' tab-btn--active' : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                Comments
              </button>
            </div>

            <div class="drawer-content">
              {activeTab === 'posts' && <PostsTabContent posts={posts} />}
              {activeTab === 'comments' && <CommentsTabContent comments={comments} />}
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function PostsTabContent({ posts }: { posts: AsyncState<Post[]> }) {
  if (posts.loading) {
    return (
      <div class="tab-state">
        <div class="spinner" />
        <p>Ładowanie postów…</p>
      </div>
    );
  }
  if (posts.error) {
    return (
      <div class="tab-state tab-state--error">
        <p>Błąd: {posts.error}</p>
      </div>
    );
  }
  if (!posts.data || posts.data.length === 0) {
    return (
      <div class="tab-state">
        <p>Brak postów.</p>
      </div>
    );
  }
  return (
    <ul class="post-list">
      {posts.data.map((post) => (
        <li key={post.id} class="post-item">
          <h3 class="post-title">{post.title}</h3>
          <p class="post-body">{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

function CommentsTabContent({ comments }: { comments: AsyncState<Comment[]> }) {
  if (comments.loading) {
    return (
      <div class="tab-state">
        <div class="spinner" />
        <p>Ładowanie komentarzy…</p>
      </div>
    );
  }
  if (comments.error) {
    return (
      <div class="tab-state tab-state--error">
        <p>Błąd: {comments.error}</p>
      </div>
    );
  }
  if (!comments.data || comments.data.length === 0) {
    return (
      <div class="tab-state">
        <p>Brak komentarzy.</p>
      </div>
    );
  }
  return (
    <ul class="comment-list">
      {comments.data.map((comment) => (
        <li key={comment.id} class="comment-item">
          <div class="comment-meta">
            <span class="comment-name">{comment.name}</span>
            <span class="comment-email">{comment.email}</span>
          </div>
          <p class="comment-body">{comment.body}</p>
        </li>
      ))}
    </ul>
  );
}
