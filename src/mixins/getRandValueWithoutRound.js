export default {
  methods: {
    getRandValueWithoutRound(maxIndex, minLength = 1) {
      const randResult = Math.random() * (maxIndex - minLength) + minLength;

      return randResult;
    },
  },
};
