import _ from 'lodash';
import { createSelector } from '@reduxjs/toolkit';


const getSubscriptions = store => store.monitoring.subscriptions;
const getSubscriptionsOrder = store => store.monitoring.subscriptionsOrder;


const getSubscriptionsOrdered = createSelector(
    [getSubscriptions, getSubscriptionsOrder],
    (subscriptions, order) => _.sortBy(subscriptions, sub => _.indexOf(order, sub.subscription.id)),
);

export default {
    getSubscriptionsOrdered,
};
