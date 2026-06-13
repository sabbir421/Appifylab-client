const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

const uploadWithProgress = (endpoint, formData, onProgress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}${endpoint}`);

    const token = getToken();
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.addEventListener('progress', (event) => {
      if (!onProgress) return;
      if (event.lengthComputable) {
        const uploadPercent = Math.round((event.loaded / event.total) * 90);
        onProgress(Math.min(90, uploadPercent));
      }
    });

    xhr.addEventListener('load', () => {
      let data;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        reject(new Error('Request failed'));
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve(data);
        return;
      }

      reject(new Error(data.message || 'Request failed'));
    });

    xhr.addEventListener('error', () => reject(new Error('Network error')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

    xhr.send(formData);
  });

export const api = {
  register: (body) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  getMe: () => request('/auth/me'),

  getFeed: (page = 1) => request(`/feed?page=${page}`),

  createPost: (formData, onProgress) =>
    uploadWithProgress('/posts', formData, onProgress),

  togglePostLike: (postId) =>
    request(`/posts/${postId}/like`, { method: 'POST' }),

  createComment: (postId, content) =>
    request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  getComments: (postId, page = 1, limit = 20) =>
    request(`/posts/${postId}/comments?page=${page}&limit=${limit}`),

  createReply: (commentId, content) =>
    request(`/comments/${commentId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  toggleCommentLike: (commentId) =>
    request(`/comments/${commentId}/like`, { method: 'POST' }),

  toggleReplyLike: (replyId) =>
    request(`/replies/${replyId}/like`, { method: 'POST' }),
};

export const getImageUrl = (path) => {
  if (!path) return null;

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5001';

  if (path.includes('.amazonaws.com/')) {
    const key = decodeURIComponent(path.split('.amazonaws.com/')[1]);
    return `${serverUrl}/api/media/${key}`;
  }

  if (path.startsWith('posts/')) {
    return `${serverUrl}/api/media/${path}`;
  }

  if (path.startsWith('http')) return path;

  return `${serverUrl}${path.startsWith('/') ? path : `/${path}`}`;
};
