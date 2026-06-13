'use client';

const AVATAR_COLORS = ['#1890FF', '#52c41a', '#faad14', '#eb2f96', '#722ed1'];

function LikerAvatar({ liker, isFirst }) {
  const initials = liker.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const color = AVATAR_COLORS[liker.id % AVATAR_COLORS.length];

  return (
    <span
      className={isFirst ? '_react_img1' : '_react_img'}
      title={liker.name}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        minWidth: 32,
        borderRadius: '50%',
        background: color,
        color: '#fff',
        fontSize: 11,
        fontWeight: 600,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {initials}
    </span>
  );
}

export default function LikersList({ likers = [], likeCount = 0 }) {
  if (!likeCount) return null;

  const displayLikers = likers.slice(0, 3);
  const showCountBadge = likeCount > displayLikers.length;

  return (
    <div className="_feed_inner_timeline_total_reacts_image">
      {displayLikers.map((liker, index) => (
        <LikerAvatar key={liker.id} liker={liker} isFirst={index === 0} />
      ))}
      {showCountBadge && (
        <p className="_feed_inner_timeline_total_reacts_para">
          {likeCount > 99 ? '99+' : likeCount}
        </p>
      )}
    </div>
  );
}
