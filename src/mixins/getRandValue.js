export default {
  methods: {
    getRandValue(maxIndex, minLength = 1) {
      const randResult = Math.floor(Math.random() * (maxIndex - minLength) + minLength);

      return randResult;
    },
  },
};
