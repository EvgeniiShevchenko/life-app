import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    playerInfo: {
      money: 17000,
      vipStatus: true,
      freeSpins: 1,
      coins: 56,
    },
  };
};

const store = new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    setMoney(state, payload) {
      state.playerInfo.money = payload;
    },

    setSpins(state, payload) {
      state.playerInfo.freeSpins = payload;
    },

    setCoins(state, payload) {
      state.playerInfo.coins = payload;
    },
  },
  actions: {
    setMoney({ commit }, money) {
      commit('setMoney', money);
    },

    setSpins({ commit }, spinsValue) {
      commit('setSpins', spinsValue);
    },
    
    setCoins({ commit }, coinsValue) {
      commit('setCoins', coinsValue);
    },
  },
});
export default store;
