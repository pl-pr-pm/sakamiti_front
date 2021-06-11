<template>
    <div>
        <modal name="result-modal" :draggable="true" :resizable="true" width="85%" height="70%">
             <h1>{{ judgeStatus }}</h1>
             <h1>{{ judgeResult }}</h1>
        </modal>
    </div>
</template>

<script>
import {targetURL} from '../config';
export default {
    data: function() {
    return {
            uploadFile: null,
            urls: {
                upload_url: targetURL.upload_url,
                preprocess_url: targetURL.preprocess_url,
                prediction_url: targetURL.prediction_url,
            }
        }
    },
    props: ['judgeStatus', 'warmStatus', 'judgeResult'],
    methods: {
}}
</script>