<template>
  
  <div id="overall">
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

#overall {
  /* background-image: url(image/predict_idle_desktop.jpg); */
  /* background-color: rgb(255, 251, 196); */

  background-repeat: no-repeat;
  background-size: cover;

  width:100%;
  height: 100%;

  margin: 5px 10px 5px; /* 左 上下 右 */
/*
  padding: 5px;



/*border-width: thick;
  border-style: solid;*/


}
#activate_load {
  float:left;
}

#title {
  font-family: Arial, Helvetica, sans-serif;

  border-bottom: 2px solid rgb(99, 107, 109);
  padding: 5px;
  font-size: 35px;
}
button {
  display: inline-block;
  padding: 0.3em 1em;
  text-decoration: none;
  color: #c2c1c1;
  border: solid 2px #353738;
  border-radius: 3px;
  transition: .4s;
}

button:hover {
  background: #504e4e;
  color: rgb(40, 231, 183);
}

#activate_load {
  text-align: left;

}

#judge_status {

}

#judge_result {
  
}
</style>