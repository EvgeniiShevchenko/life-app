import axios from 'axios';
import timeOutPromise from '@/mixins/timeOutPromise.js';


export const getWelcomeDailyReward = async function () {
  try {
    await timeOutPromise(0);

    const { data } = await axios.get('mocks/collectionWelcomeDailyReward.json', { method: 'GET' });

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getWelcomeSpecialOffers = async function () {
  try {
    await timeOutPromise(0);

    const { data } = await axios.get('mocks/collectionWelcomeSpecialOffers.json', { method: 'GET' });

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getWelcomeWheelList = async function () {
  try {
    await timeOutPromise(0);

    const { data } = await axios.get('mocks/collectionWelcomeLuckyWheel.json', { method: 'GET' });

    return data;
  } catch (error) {
    console.error(error);
  }
};

export default {
  getWelcomeDailyReward,
  getWelcomeSpecialOffers,
  getWelcomeWheelList,
};
