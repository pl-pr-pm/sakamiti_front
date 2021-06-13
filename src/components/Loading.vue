<template>
<div>
<div v-show="coldIsLoading">
    <div class="fullview">
      <div class="loading-spacer"></div>
      <vue-loading 
        type="barsCylon"
        color="#aaa"
        :size="{ width: '100px', height: '100px' }"
        >
      </vue-loading>
    </div>
</div>
<div v-show="predictionIsLoading">
    <div class="fullview">
      <div class="loading-spacer"></div>
      <vue-loading 
        type="spin"
        color="#aaa"
        :size="{ width: '100px', height: '100px' }"
        >
      </vue-loading>
    </div>
</div>
</div>

</template>

<script>
import { VueLoading } from 'vue-loading-template'

export default {
  name: 'loading',
  props:['coldIsLoading', 'predictionIsLoading'],
  components: {
    VueLoading,
  },

}
</script>

<style>
/*.fullview {
  width: 100%;
  height: 100%;
  background: #fefefe;
  position: fixed;
  top: 0;
  left: 0;
}
*/
.loading-spacer {
  height: 30%;
}

</style>