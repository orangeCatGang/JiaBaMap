import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useStarsStore = defineStore('stars', () => {
  const totalStars = 5;
  const hoverIndex = ref(0);
  const selectIndex = ref(0);

  const hints = ['很不喜歡', '需要加油', '普通', '還不錯', '非常推薦'];
  const scores = ['1.0 ★', '2.0 ★', '3.0 ★', '4.0 ★', '5.0 ★'];

  const hint = computed(() => {
    if (hoverIndex.value > 0) {
      return [hints[hoverIndex.value - 1], scores[hoverIndex.value - 1]];
    }
    if (selectIndex.value > 0) {
      return [hints[selectIndex.value - 1], scores[selectIndex.value - 1]];
    }
    return ['給予評分'];
  });

  const resetHoverIndex = () => {
    hoverIndex.value = 0;
  };

  const setHoverIndex = (index) => {
    hoverIndex.value = index;
  };

  const setSelectIndex = (index) => {
    selectIndex.value = index;
  };

  const resetStars = () => {
    hoverIndex.value = 0;
    selectIndex.value = 0;
  };

  return {
    totalStars,
    hoverIndex,
    selectIndex,
    hint,
    resetHoverIndex,
    setHoverIndex,
    setSelectIndex,
    resetStars,
  };
});
