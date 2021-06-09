<template>
  <div>
    <explanation/>
    <upload/>
    <fotter/>

  </div>
</template>

<script>

import explanation from './components/Explanation'
import upload from './components/Upload'
import fotter from './components/Fotter'

export default {
  components: {
    explanation,
    upload,
    fotter,
  },
};
</script>
