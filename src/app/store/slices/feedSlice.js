import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/app/utils/api';

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await api.getFeed(page);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'feed/createPost',
  async (payload, { rejectWithValue }) => {
    try {
      const formData = payload instanceof FormData ? payload : payload.formData;
      const onProgress = payload instanceof FormData ? undefined : payload.onProgress;
      const res = await api.createPost(formData, onProgress);
      return res.data.post;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const togglePostLike = createAsyncThunk(
  'feed/togglePostLike',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await api.togglePostLike(postId);
      return { postId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'feed/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const res = await api.createComment(postId, content);
      return { postId, comment: res.data.comment };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addReply = createAsyncThunk(
  'feed/addReply',
  async ({ commentId, postId, content }, { rejectWithValue }) => {
    try {
      const res = await api.createReply(commentId, content);
      return { postId, commentId, reply: res.data.reply };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  'feed/toggleCommentLike',
  async ({ commentId, postId }, { rejectWithValue }) => {
    try {
      const res = await api.toggleCommentLike(commentId);
      return { postId, commentId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleReplyLike = createAsyncThunk(
  'feed/toggleReplyLike',
  async ({ replyId, postId, commentId }, { rejectWithValue }) => {
    try {
      const res = await api.toggleReplyLike(replyId);
      return { postId, commentId, replyId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const expandComments = createAsyncThunk(
  'feed/expandComments',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await api.getComments(postId, 1, 20);
      return { postId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadMoreComments = createAsyncThunk(
  'feed/loadMoreComments',
  async ({ postId, page }, { rejectWithValue }) => {
    try {
      const res = await api.getComments(postId, page, 20);
      return { postId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    posts: [],
    loading: false,
    creating: false,
    error: null,
    page: 1,
  },
  reducers: {
    clearFeedError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.page = action.payload.pagination.page;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.creating = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.creating = false;
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      .addCase(togglePostLike.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) {
          post.isLiked = action.payload.liked;
          post.likeCount = action.payload.likeCount;
          post.likers = action.payload.likers;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) {
          post.comments = [action.payload.comment, ...(post.comments || [])];
          post.commentCount = (post.commentCount || 0) + 1;
          post.commentsExpanded = true;
        }
      })
      .addCase(addReply.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) {
          const comment = post.comments?.find(
            (c) => c.id === action.payload.commentId
          );
          if (comment) {
            comment.replies = [...(comment.replies || []), action.payload.reply];
          }
        }
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        const comment = post?.comments?.find(
          (c) => c.id === action.payload.commentId
        );
        if (comment) {
          comment.isLiked = action.payload.liked;
          comment.likeCount = action.payload.likeCount;
          comment.likers = action.payload.likers;
        }
      })
      .addCase(toggleReplyLike.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        const comment = post?.comments?.find(
          (c) => c.id === action.payload.commentId
        );
        const reply = comment?.replies?.find(
          (r) => r.id === action.payload.replyId
        );
        if (reply) {
          reply.isLiked = action.payload.liked;
          reply.likeCount = action.payload.likeCount;
          reply.likers = action.payload.likers;
        }
      })
      .addCase(expandComments.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (!post) return;

        post.comments = action.payload.comments;
        post.commentsExpanded = true;
        post.commentsPage = action.payload.pagination.page;
      })
      .addCase(loadMoreComments.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (!post) return;

        const existingIds = new Set((post.comments || []).map((c) => c.id));
        const newComments = action.payload.comments.filter((c) => !existingIds.has(c.id));
        post.comments = [...(post.comments || []), ...newComments];
        post.commentsExpanded = true;
        post.commentsPage = action.payload.pagination.page;
      });
  },
});

export const { clearFeedError } = feedSlice.actions;
export default feedSlice.reducer;
