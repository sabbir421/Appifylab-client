'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useDarkMode } from '@/app/hooks/useFeedUi';
import ThemeToggle from './components/ThemeToggle';
import FeedHeader from './components/FeedHeader';
import FeedLeftSidebar from './components/FeedLeftSidebar';
import FeedRightSidebar from './components/FeedRightSidebar';
import StoriesSection from './components/StoriesSection';
import CreatePost from './components/CreatePost';
import PostCard from './components/PostCard';
import { fetchFeed } from '@/app/store/slices/feedSlice';

export default function FeedPage() {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.feed);
  const { darkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  return (
    <ProtectedRoute>
      <div className={`_layout _layout_main_wrapper ${darkMode ? '_dark_wrapper' : ''}`}>
        <ThemeToggle onToggle={toggleDarkMode} />
        <div className="_main_layout">
          <FeedHeader />
          <div className="container _custom_container">
            <div className="_layout_inner_wrap">
              <div className="row">
                <FeedLeftSidebar />
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="_layout_middle_wrap">
                    <div className="_layout_middle_inner">
                      <StoriesSection />
                      <CreatePost />
                      {!loading && posts.length === 0 && null}
                      {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  </div>
                </div>
                <FeedRightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
