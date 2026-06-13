'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleCommentLike, toggleReplyLike, addReply } from '@/app/store/slices/feedSlice';
import CommentSendButton from '@/app/components/CommentSendButton';

function ReplyItem({ reply, postId, commentId }) {
  const dispatch = useDispatch();

  return (
    <div className="_comment_main _comment_reply_item">
      <div className="_comment_image">
        <img src="/assets/images/txt_img.png" alt="" className="_comment_img1" />
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <h4 className="_comment_name_title">{reply.author?.fullName}</h4>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text"><span>{reply.content}</span></p>
          </div>
          {reply.likeCount > 0 && (
            <div className="_total_reactions">
              <div className="_total_react">
                <span className="_reaction_like">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                </span>
              </div>
              <span className="_total">{reply.likeCount}</span>
            </div>
          )}
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li>
                  <span
                    role="button"
                    tabIndex={0}
                    className={reply.isLiked ? '_feed_reaction_active' : ''}
                    onClick={() => dispatch(toggleReplyLike({ replyId: reply.id, postId, commentId }))}
                  >
                    {reply.isLiked ? 'Unlike' : 'Like'}
                  </span>
                </li>
                <li className="_comment_time_item"><span className="_time_link">{reply.timeAgo}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommentItem({ comment, postId, previewMode = false }) {
  const dispatch = useDispatch();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const visibleReplies = previewMode
    ? (comment.replies || []).slice(-1)
    : comment.replies || [];

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const result = await dispatch(addReply({ commentId: comment.id, postId, content: replyText.trim() }));
    if (addReply.fulfilled.match(result)) {
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <img src="/assets/images/txt_img.png" alt="" className="_comment_img1" />
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <h4 className="_comment_name_title">{comment.author?.fullName}</h4>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text"><span>{comment.content}</span></p>
          </div>
          {comment.likeCount > 0 && (
            <div className="_total_reactions">
              <div className="_total_react">
                <span className="_reaction_like">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                </span>
              </div>
              <span className="_total">{comment.likeCount}</span>
            </div>
          )}
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li>
                  <span
                    role="button"
                    tabIndex={0}
                    className={comment.isLiked ? '_feed_reaction_active' : ''}
                    onClick={() => dispatch(toggleCommentLike({ commentId: comment.id, postId }))}
                  >
                    {comment.isLiked ? 'Unlike' : 'Like'}
                  </span>
                </li>
                <li>
                  <span role="button" tabIndex={0} onClick={() => setShowReplyForm(!showReplyForm)}>Reply</span>
                </li>
                <li className="_comment_time_item"><span className="_time_link">{comment.timeAgo}</span></li>
              </ul>
            </div>
          </div>
        </div>

        {showReplyForm && (
          <div className="_feed_inner_comment_box">
            <form className="_feed_inner_comment_box_form" onSubmit={handleReply}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img src="/assets/images/comment_img.png" alt="" className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea className="form-control _comment_textarea" placeholder="Write a reply" value={replyText} onChange={(e) => setReplyText(e.target.value)} required />
                </div>
              </div>
              <div className="_feed_inner_comment_box_icon">
                <CommentSendButton disabled={!replyText.trim()} />
              </div>
            </form>
          </div>
        )}

        {visibleReplies.map((reply) => (
          <ReplyItem key={reply.id} reply={reply} postId={postId} commentId={comment.id} />
        ))}
      </div>
    </div>
  );
}
