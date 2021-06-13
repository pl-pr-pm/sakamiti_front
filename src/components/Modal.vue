<template>
    <div>
        <modal name="result-modal" :draggable="true" :resizable="true" width="85%" height="70%">
             <h1>{{ judgeStatus }}</h1>
             <h1>{{ judgeResult }}</h1>
        <vue-simple-spinner></vue-simple-spinner>
        </modal>
    </div>
</template>

<script>

export default {
    data: function() {
    return {
        }
    },
    props: ['judgeStatus', 'warmStatus', 'judgeResult'],
    methods: {
}}
</script>