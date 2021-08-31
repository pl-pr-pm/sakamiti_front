<template>
    <div>
        <modal name="result-modal" :draggable="true" :resizable="true" width="40%" height="50%">
             <h2 id=judge_status> Judge Status is {{ judgeStatus }}</h2>
             <h2 id=judge_result v-show="!predictionIsLoading">Result<br>{{ judgeResult }}46</h2>
        <Loading :predictionIsLoading = this.predictionIsLoading id="predict_load">></Loading>
        </modal>
    </div>
</template>

<script>
import Loading from './Loading'

export default {
    
    data: function() {
    return {
        }
    },
    props: ['judgeStatus', 'warmStatus', 'judgeResult', 'predictionIsLoading'],
    methods: {
},components: {
        Loading,
    }
}
</script>