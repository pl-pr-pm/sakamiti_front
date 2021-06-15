<template>
  
  <div>
    <head>
      <link rel="stylesheet" href='css/style.css'>
    </head>
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

<style>
template {
  background-image: url(image/predict_idle_desktop.jpg);
}
</style>