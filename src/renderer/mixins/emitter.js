export default {
  methods: {
    dispatch(eventName, ...params) {
      this.$parent.$emit.apply(this.$parent, [eventName, ...params]);
    },
    broadcast(eventName, ...params) {
      this.$children.forEach(child => {
        child.$emit.apply(child, [eventName, ...params]);
      });
    }
  }
};
