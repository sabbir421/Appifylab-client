'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/app/store/slices/authSlice';
import FeedHeaderStatic from '../html/FeedHeaderStatic';

export default function FeedHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const displayName = user?.fullName || 'Dylan Field';

  useEffect(() => {
    document.querySelectorAll('._header_nav_para, ._nav_dropdown_title').forEach((el) => {
      el.textContent = displayName;
    });
  }, [displayName]);

  useEffect(() => {
    const profileBtn = document.getElementById('_profile_drop_show_btn');
    const profileDrop = document.getElementById('_prfoile_drop');
    const onProfileClick = (e) => {
      e.preventDefault();
      profileDrop?.classList.toggle('show');
    };
    profileBtn?.addEventListener('click', onProfileClick);

    const notifyBtn = document.getElementById('_notify_btn');
    const notifyDrop = document.getElementById('_notify_drop');
    const onNotifyClick = () => notifyDrop?.classList.toggle('show');
    notifyBtn?.addEventListener('click', onNotifyClick);

    return () => {
      profileBtn?.removeEventListener('click', onProfileClick);
      notifyBtn?.removeEventListener('click', onNotifyClick);
    };
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll('._nav_dropdown_list_item');
    const logoutItem = items[items.length - 1];
    const logoutLink = logoutItem?.querySelector('._nav_dropdown_link');
    const onLogout = (e) => {
      e.preventDefault();
      dispatch(logout());
      router.push('/login');
    };
    logoutLink?.addEventListener('click', onLogout);
    return () => logoutLink?.removeEventListener('click', onLogout);
  }, [dispatch, router]);

  return <FeedHeaderStatic />;
}
