import create from "zustand";

const useStore = create(() => ({
  nav: 10,
  pause: true
}));

export default useStore;
