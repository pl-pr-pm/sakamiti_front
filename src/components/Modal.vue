<template>
    <div>
        <modal name="result-modal" :draggable="true" :resizable="true" width="85%" height="70%">
             <h1>{{ judgeStatus }}</h1>
             <h1>{{ judgeResult }}</h1>
        <Loading :predictionIsLoading = this.predictionIsLoading></Loading>
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