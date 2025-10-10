import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '@store';
import { getFeedThunk } from '@slices/feedSlice';

export const Feed: FC = () => {
  const { ordersData, loading } = useSelector((state) => state.feed);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedThunk());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={ordersData.orders}
      handleGetFeeds={() => dispatch(getFeedThunk())}
    />
  );
};
