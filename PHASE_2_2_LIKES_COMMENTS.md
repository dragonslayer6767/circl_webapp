# PHASE 2.2: LIKES & COMMENTS IMPLEMENTATION GUIDE

**Target:** Complete like and comment functionality for forum posts  
**Estimated Time:** 8-10 hours  
**Status:** 20% Complete - Service endpoints ready, components need building

---

## 📋 OVERVIEW

This phase adds interactivity to posts:
- ❤️ Like posts and comments
- 💬 Comment on posts
- ⭐ Show like counts
- 👥 Show comment counts

---

## 🎯 IMPLEMENTATION PLAN

### 2.2.1: Like Button Integration (2-3 hours)

#### Task 1A: Add Like Button to ForumPost Component

**File:** `src/components/forum/ForumPost.tsx`

Add like button UI:
```tsx
<button
  onClick={() => handleLike()}
  className="flex items-center gap-2 text-gray-600 hover:text-red-500"
>
  <span className={likedByUser ? 'text-red-500' : ''}>❤️</span>
  <span>{likeCount}</span>
</button>
```

#### Task 1B: Implement Like Handler

In ForumPost component:
```typescript
const [likeCount, setLikeCount] = useState(post.like_count);
const [likedByUser, setLikedByUser] = useState(post.liked_by_user);
const [isLiking, setIsLiking] = useState(false);

const handleLike = async () => {
  try {
    setIsLiking(true);
    
    if (likedByUser) {
      // Unlike
      await forumService.unlikePost(post.id);
      setLikedByUser(false);
      setLikeCount(count => count - 1);
    } else {
      // Like
      await forumService.likePost(post.id);
      setLikedByUser(true);
      setLikeCount(count => count + 1);
    }
  } catch (err) {
    console.error('Failed to toggle like:', err);
    // Revert optimistic update
    setLikedByUser(!likedByUser);
    setLikeCount(likeCount);
  } finally {
    setIsLiking(false);
  }
};
```

### 2.2.2: Comment Section Component (4-5 hours)

#### Task 2A: Create CommentSection Component

**File:** `src/components/forum/CommentSection.tsx`

```typescript
interface CommentSectionProps {
  postId: number;
  onCommentAdded?: () => void;
}

export default function CommentSection({ 
  postId, 
  onCommentAdded 
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    try {
      const response = await forumService.getComments(postId);
      setComments(response.results);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      const comment = await forumService.createComment(postId, {
        content: newComment,
      });
      
      setComments([...comments, comment]);
      setNewComment('');
      onCommentAdded?.();
    } catch (err) {
      console.error('Failed to create comment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 mt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-gray-600 hover:text-blue-500 text-sm font-medium p-4"
      >
        {showComments ? '✕ Hide' : '💬 Show'} {comments.length} Comments
      </button>

      {showComments && (
        <>
          {/* Comment List */}
          <div className="space-y-3 p-4 border-t border-gray-200">
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                onLike={() => {/* implement */}}
              />
            ))}
          </div>

          {/* Comment Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <img
                src={userAvatar}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full border rounded-lg p-2 resize-none"
                  rows={2}
                  disabled={isLoading}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? 'Posting...' : 'Comment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
```

#### Task 2B: Create CommentItem Component

**File:** `src/components/forum/CommentItem.tsx`

```typescript
interface CommentItemProps {
  comment: Comment;
  postId: number;
  onLike: () => void;
  onDelete?: () => void;
}

export default function CommentItem({
  comment,
  postId,
  onLike,
}: CommentItemProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(comment.liked_by_user);
  const [likeCount, setLikeCount] = useState(comment.like_count);

  const handleLike = async () => {
    try {
      if (liked) {
        await forumService.unlikeComment(postId, comment.id);
        setLiked(false);
        setLikeCount(count => count - 1);
      } else {
        await forumService.likeComment(postId, comment.id);
        setLiked(true);
        setLikeCount(count => count + 1);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  return (
    <div className="flex gap-3">
      <img
        src={getAvatar(comment.user)}
        alt={comment.user}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="font-semibold text-sm">{comment.user}</div>
          <div className="text-sm text-gray-800">{comment.content}</div>
        </div>
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span>{formatTimeAgo(comment.created_at)}</span>
          <button
            onClick={handleLike}
            className="hover:text-red-500"
          >
            {liked ? '❤️' : '🤍'} {likeCount}
          </button>
          {comment.user_id === user?.user_id && (
            <button className="hover:text-gray-700">Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 2.2.3: Integrate into ForumPost (1-2 hours)

**File:** `src/components/forum/ForumPost.tsx`

Update to include:
```tsx
return (
  <div className="border-b border-gray-200 bg-white">
    {/* Existing post header */}
    <div className="p-4">
      {/* Post content */}
    </div>

    {/* Actions row */}
    <div className="flex justify-between px-4 py-2 border-t border-gray-100 text-gray-600 text-sm">
      <button
        onClick={handleLike}
        className="flex items-center gap-2 hover:text-red-500"
      >
        {likedByUser ? '❤️' : '🤍'} {likeCount}
      </button>
      <button
        onClick={handleComment}
        className="flex items-center gap-2 hover:text-blue-500"
      >
        💬 {commentCount}
      </button>
    </div>

    {/* Comments section */}
    {showComments && <CommentSection postId={post.id} />}
  </div>
);
```

---

## 🗂️ NEW FILES TO CREATE

```
src/components/forum/
├── CommentSection.tsx ⏳ New
├── CommentItem.tsx ⏳ New
├── LikeButton.tsx ⏳ New (optional)
└── CommentButton.tsx ⏳ New (optional)
```

---

## 🔗 API ENDPOINTS REFERENCE

### Like Endpoints (Already in forumService)
```typescript
// Like a post
await forumService.likePost(postId: number)
// Response: { message: string }

// Unlike a post
await forumService.unlikePost(postId: number)
// Response: { message: string }

// Like a comment
await forumService.likeComment(postId: number, commentId: number)
// Response: { message: string }

// Unlike a comment
await forumService.unlikeComment(postId: number, commentId: number)
// Response: { message: string }
```

### Comment Endpoints (Already in forumService)
```typescript
// Get comments on a post
const { count, results } = await forumService.getComments(
  postId: number,
  page?: number,      // Default: 1
  pageSize?: number   // Default: 50
)
// Response: { count: number, results: Comment[] }

// Create comment
const comment = await forumService.createComment(
  postId: number,
  payload: { content: string }
)
// Response: Comment

// Update comment
const comment = await forumService.updateComment(
  postId: number,
  commentId: number,
  payload: { content: string }
)
// Response: Comment

// Delete comment
await forumService.deleteComment(postId: number, commentId: number)
// Response: void
```

---

## 🧪 TESTING CHECKLIST

### Like Functionality Tests
- [ ] Like button appears on post
- [ ] Like button toggles state (filled/unfilled heart)
- [ ] Like count updates when clicked
- [ ] Unlike works (removes like)
- [ ] Like persists on page refresh
- [ ] Like count shows correct number
- [ ] Error handling when API fails
- [ ] Disabled state during request

### Comment Functionality Tests
- [ ] Comment count shows on post
- [ ] Click comment button expands section
- [ ] Comments load from API
- [ ] Can type in comment input
- [ ] Submit button works
- [ ] New comment appears in list
- [ ] Comment shows user name and timestamp
- [ ] Can like individual comments
- [ ] Can delete own comments
- [ ] Empty comments handled gracefully

### Edge Cases
- [ ] Comment with emoji
- [ ] Comment with long text (word wrap)
- [ ] Multiple comments (pagination)
- [ ] Comment on deleted post
- [ ] Like comment then delete post
- [ ] Network error during like
- [ ] Network error during comment submit

---

## 📝 DATA TYPES

```typescript
// From forumService
interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  user: string;
  content: string;
  created_at: string;
  like_count: number;
  liked_by_user: boolean;
}

interface ForumPost {
  id: number;
  user_id: number;
  user: string;
  content: string;
  category: string;
  privacy: string;
  image?: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  liked_by_user: boolean;
  comment_count: number;
}
```

---

## 🎨 UI/UX CONSIDERATIONS

### Like Button
- Show filled heart (❤️) if liked
- Show empty heart (🤍) if not liked
- Show count next to button
- Hover effect (darker red)
- Disabled during request

### Comment Section
- "Show X comments" button
- Expandable/collapsible
- Comment list with newest first
- Comment input at bottom
- User avatar + name + timestamp
- Delete button for own comments
- Like button on comments

### Visual Hierarchy
- Post content (large, primary)
- Like/comment counts (medium, secondary)
- Comment section (expandable, tertiary)
- Comment content (small, readable)

---

## 🚀 IMPLEMENTATION ORDER

1. **Day 1:**
   - [ ] Create CommentItem component
   - [ ] Create CommentSection component
   - [ ] Test comment fetching

2. **Day 2:**
   - [ ] Add like button to ForumPost
   - [ ] Implement like/unlike handlers
   - [ ] Test like functionality

3. **Day 3:**
   - [ ] Integrate CommentSection into ForumPost
   - [ ] Test comment submission
   - [ ] Test comment likes
   - [ ] Edge case testing

4. **Day 4:**
   - [ ] Performance optimization
   - [ ] Bug fixes
   - [ ] Final testing

---

## 🆘 COMMON PITFALLS

### State Management
❌ Don't forget to revert optimistic updates on error
✅ Update local state immediately, revert if API fails

### API Calls
❌ Don't create new API instances in every render
✅ Use proper dependency arrays in useEffect

### Performance
❌ Don't fetch all comments immediately
✅ Fetch comments only when expanded

### UX
❌ Don't show loading spinner for every action
✅ Use optimistic updates for snappy UX

---

## 📚 REFERENCE IMPLEMENTATIONS

### Optimistic Update Pattern
```typescript
const handleLike = async () => {
  // Optimistic update
  setLiked(!liked);
  setLikeCount(count => liked ? count - 1 : count + 1);

  try {
    if (liked) {
      await forumService.unlikePost(postId);
    } else {
      await forumService.likePost(postId);
    }
  } catch (err) {
    // Revert on error
    setLiked(!liked);
    setLikeCount(count => liked ? count + 1 : count - 1);
    throw err;
  }
};
```

### Loading State Pattern
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  try {
    setIsLoading(true);
    await apiCall();
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};
```

---

## ✅ COMPLETION CRITERIA

Phase 2.2 is complete when:
1. Like button works on posts
2. Like count updates correctly
3. Unlike works correctly
4. Comments can be viewed
5. New comments can be created
6. Comments display user info
7. Comments can be liked/unliked
8. Comment count updates
9. Expandable comment section
10. All error handling works
11. Optimistic updates work
12. Loading states show properly
13. All tests pass

---

## 📋 NEXT PHASE

Once Phase 2.2 is complete, proceed with:
**Phase 2.3: Profile Viewing** (6-8 hours)
- Create ProfileView page
- Show user's recent posts
- Connection button

---

**Start with CommentItem and CommentSection components**
