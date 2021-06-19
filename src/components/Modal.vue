<template>
    <div>
        <modal name="result-modal" :draggable="true" :resizable="true" width="50%" height="60%">
             <h1 id=judge_status>{{ judgeStatus }}</h1>
             <h1 id=judge_result>{{ judgeResult }}</h1>
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