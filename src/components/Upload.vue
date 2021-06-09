<template>
    <div name="upload">
        <button name="start_button" v-on:click="warmupLambda"> AI 起動 (数分かかる場合があります)
        </button>
        <p v-if="this.warmStatus[this.warmStatus.length - 1]== 9"> AI が眠っているようです。再度、診断開始ボタンを押してください。数分かかる場合があります。

        <div name="button" v-if="this.warmStatus[this.warmStatus.length - 2] == 9">
           <p> お待たせしました。<br> </p>
        </div>
        <div name="button" v-if="this.warmStatus[this.warmStatus.length - 1] == 1">
           <p> あなたの画像をアップロードしてください。<br> </p>
           <p>{{judgeStatus}}</p>
           <input  v-on:change="onFileChange" type="file" name="file" placeholder="Photo from your computer" accept="image/*" required>
           <button v-on:click="uploadImage"> Upload </button>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
import {postTarget} from '../util';
import {targetURL} from '../config';

export default {
    data: function() {
        return {
            uploadFile: null,
            warmStatus: [0],
            judgeStatus: "審査前",
            urls: {
                upload_url: targetURL.upload_url,
                preprocess_url: targetURL.preprocess_url,
                prediction_url: targetURL.prediction_url,
            }
        }
    },
    methods: {
        warmupLambda: async function() {

        // バックエンドのlambdaのコンテナを起動させる
        // ライブラリの読み込みに時間のかかる、preprocess/ predictionを対象とする
        // が、しかし、predictionのインポートはやはり遅く、503(API gateway <-> lambdaのタイムアウト)が発生する
        // そのため、503の場合は、再度ユーザーに操作を促す

            let self = this;
            let preprocessHttpStatusCd = null;
            let predictionHttpStatusCd = null;

            preprocessHttpStatusCd = await postTarget(self.urls.preprocess_url)
            predictionHttpStatusCd = await postTarget(self.urls.prediction_url)

            // console.log('predictionHttpStatusCd', predictionHttpStatusCd)
            // console.log('preprocessHttpStatusCd', preprocessHttpStatusCd)

            if (preprocessHttpStatusCd === 503 || predictionHttpStatusCd === 503) {
                self.warmStatus.push(9);
                console.log(self.warmStatus[self.warmStatus.length - 1])
            }

            if (preprocessHttpStatusCd === 201 && predictionHttpStatusCd === 201) {
                self.warmStatus.push(1);
            }
        },
        onFileChange: function(event) {
            this.uploadFile = event.target.files[0];
            console.log(this.uploadFile);
        },
        uploadImage: function(){
            // thisの参照スコープからselfにthisを代入する
            // https://stackoverflow.com/questions/32547735/javascript-promises-how-to-access-variable-this-inside-a-then-scope#
            let self = this
            const targetFile = self.uploadFile;
            const upload_url = self.urls.upload_url;
            axios.post(upload_url, targetFile, {
                headers: {
                    "Content-Type": targetFile.type
                }
            }).then(function(res) {
                console.log(res.data);
                if (res.status === 200) {
                    // file upload 完了
                    self.judgeStatus = "審査員に画像を届けています";
                    const saved_file_path = JSON.parse(JSON.stringify(res.data));
                    console.log(saved_file_path.saved_file_path);
                    axios.post(self.urls.preprocess_url, saved_file_path.saved_file_path,{
                        headers: {
                    "Content-Type": 'application/json'
                }
            }).then(function(res) {
                console.log(res);
                if (res.status === 200) {
                    self.judgeStatus = "審査を開始しています";
                    const output_file_path = JSON.parse(JSON.stringify(res.data));
                    console.log(output_file_path.output_file_path);
                    axios.post(self.urls.prediction_url, output_file_path.output_file_path,{
                        headers: {
                    "Content-Type": 'application/json'
                    }}).then(function(res) {
                        console.log(res);
                    });
                }
            });
        }
    }
            )}}}
</script>

<style >


</style>