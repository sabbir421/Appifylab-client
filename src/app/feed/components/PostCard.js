'use client';

import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { togglePostLike, addComment, expandComments, loadMoreComments } from '@/app/store/slices/feedSlice';
import { getImageUrl } from '@/app/utils/api';
import { useToggle } from '@/app/hooks/useFeedUi';
import LikersList from '@/app/components/LikersList';
import CommentSendButton from '@/app/components/CommentSendButton';
import LikeReactionIcon from '@/app/components/LikeReactionIcon';
import CommentItem from './CommentItem';

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState('');
  const [expandingComments, setExpandingComments] = useState(false);
  const commentInputRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const isAuthor = Number(user?.id) === Number(post.author?.id);
  const dropdown = useToggle();
  const imageUrl = getImageUrl(post.imageUrl);
  const commentsExpanded = Boolean(post.commentsExpanded);

  const handleLike = () => dispatch(togglePostLike(post.id));

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const result = await dispatch(addComment({ postId: post.id, content: commentText.trim() }));
    if (addComment.fulfilled.match(result)) setCommentText('');
  };

  const visibleComments = commentsExpanded
    ? post.comments || []
    : (post.comments || []).slice(0, 1);

  const hasMoreComments =
    commentsExpanded && (post.commentCount || 0) > (post.comments || []).length;
  const nextCommentsPage = (post.commentsPage || 1) + 1;

  const handleExpandComments = async () => {
    const count = Number(post.commentCount) || 0;

    if (!commentsExpanded && count > 0) {
      setExpandingComments(true);
      await dispatch(expandComments(post.id));
      setExpandingComments(false);
    }

    commentInputRef.current?.focus();
    commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleLoadMoreComments = () => {
    dispatch(loadMoreComments({ postId: post.id, page: nextCommentsPage }));
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img src="/assets/images/post_img.png" alt="" className="_post_img" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{post.author?.fullName}</h4>
              <p className="_feed_inner_timeline_post_box_para">
                {post.timeAgo} . <a href="#0">{post.visibility === 'private' ? 'Private' : 'Public'}</a>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown">
            <div className="_feed_timeline_post_dropdown">
              <button type="button" className="_feed_timeline_post_dropdown_link" onClick={dropdown.toggle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
            <div className={`_feed_timeline_dropdown _timeline_dropdown ${dropdown.open ? 'show' : ''}`}>
              <ul className="_feed_timeline_dropdown_list">
                <li className="_feed_timeline_dropdown_item">
                  <a href="#0" className="_feed_timeline_dropdown_link">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" />
                      </svg>
                    </span>
                    Save Post
                  </a>
                </li>
                <li className="_feed_timeline_dropdown_item">
                  <a href="#0" className="_feed_timeline_dropdown_link">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                        <path fill="#377DFF" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Turn On Notification
                  </a>
                </li>
                <li className="_feed_timeline_dropdown_item">
                  <a href="#0" className="_feed_timeline_dropdown_link">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5" />
                      </svg>
                    </span>
                    Hide
                  </a>
                </li>
                {isAuthor && (
                  <li className="_feed_timeline_dropdown_item">
                    <a href="#0" className="_feed_timeline_dropdown_link">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                          <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75" />
                          <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z" />
                        </svg>
                      </span>
                      Edit Post
                    </a>
                  </li>
                )}
                {isAuthor && (
                  <li className="_feed_timeline_dropdown_item">
                    <a href="#0" className="_feed_timeline_dropdown_link">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                          <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5" />
                        </svg>
                      </span>
                      Delete Post
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
        {imageUrl && (
          <div className="_feed_inner_timeline_image">
            <img src={imageUrl} alt="" className="_time_img" />
          </div>
        )}
      </div>

      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <LikersList likers={post.likers} likeCount={post.likeCount} />
        <div className="_feed_inner_timeline_total_reacts_txt">
          <button
            type="button"
            onClick={handleExpandComments}
            disabled={expandingComments}
            className="_feed_inner_timeline_total_reacts_para1 _feed_comment_count_btn"
          >
            <span>{post.commentCount || 0}</span> Comment{(post.commentCount || 0) !== 1 ? 's' : ''}
          </button>
        </div>
      </div>

      <div className="_feed_inner_timeline_reaction">
        <button
          type="button"
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${post.isLiked ? '_feed_reaction_active' : ''}`}
          onClick={handleLike}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <LikeReactionIcon active={post.isLiked} />
              {post.isLiked ? 'Unlike' : 'Like'}
            </span>
          </span>
        </button>
        <button
          type="button"
          className="_feed_inner_timeline_reaction_comment _feed_reaction"
          onClick={handleExpandComments}
          disabled={expandingComments}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
              </svg>
              {expandingComments ? 'Loading...' : 'Comment'}
            </span>
          </span>
        </button>
        <button type="button" className="_feed_inner_timeline_reaction_share _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
              </svg>
              Share
            </span>
          </span>
        </button>
      </div>

      <div className="_feed_inner_timeline_cooment_area">
        <div className="_feed_inner_comment_box">
          <form className="_feed_inner_comment_box_form" onSubmit={handleComment}>
            <div className="_feed_inner_comment_box_content">
              <div className="_feed_inner_comment_box_content_image">
                <img src="/assets/images/comment_img.png" alt="" className="_comment_img" />
              </div>
              <div className="_feed_inner_comment_box_content_txt">
                <textarea
                  ref={commentInputRef}
                  className="form-control _comment_textarea"
                  placeholder="Write a comment"
                  id={`comment-input-${post.id}`}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
            </div>
            <div className="_feed_inner_comment_box_icon">
              <CommentSendButton disabled={!commentText.trim()} />
            </div>
          </form>
        </div>
      </div>

      <div className="_timline_comment_main">
        {visibleComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={post.id}
            previewMode={!commentsExpanded}
          />
        ))}
        {!commentsExpanded && Number(post.commentCount) > 1 && (
          <button
            type="button"
            onClick={handleExpandComments}
            disabled={expandingComments}
            className="_feed_view_all_comments_btn"
          >
            {expandingComments ? 'Loading comments...' : `View all ${post.commentCount} comments`}
          </button>
        )}
        {hasMoreComments && (
          <button
            type="button"
            onClick={handleLoadMoreComments}
            className="_feed_view_all_comments_btn"
          >
            View more comments
          </button>
        )}
      </div>
    </div>
  );
}
