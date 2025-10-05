import { FC } from 'react';
import { useSelector } from '@store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const ordersData = useSelector((state) => state.feed.ordersData);

  const readyOrders = getOrders(ordersData.orders, 'done');

  const pendingOrders = getOrders(ordersData.orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={ordersData}
    />
  );
};
