<template>
    <div name="upload">
        <div name="start" v-if="this.warmStatus[this.warmStatus.length - 1] != 1">
        <button id="activate_button" name="start_button" v-on:click="warmupLambda"> AI ACTIVATE (It may take a few minutes)</button>
        <Loading :coldIsLoading = this.coldIsLoading id="activate_load"> Loading </Loading>
        </div>
        <div name="sorry_anotation" v-if="this.warmStatus[this.warmStatus.length - 1] == 9">
        <p id="sorry"> It looks like the AI hasn't started yet. Please Press the "AI ACTIVATE" button again.</p>
        <p id="annotation"> You may need to be repeated two or three times. </p>
        </div>
        <div name="button" v-if="this.warmStatus[this.warmStatus.length - 1] == 1">
        <p> Please upload your face image.<br> </p>
        <!--<label for="file_upload">CHOSE YOUR IMAGE</label> -->
        <input  v-on:change="onFileChange" type="file" id="file_upload" name="file" placeholder="Photo from your computer" accept="image/*" required>
        <button v-on:click="uploadImage" id="upload_button"> UPLOAD </button>
        </div>
        <Modal :judgeStatus = this.judgeStatus :judgeResult = this.judgeResult :predictionIsLoading = this.predictionIsLoading>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios';
import {postTarget} from '../util';
import {targetURL} from '../config';
import Modal from './Modal'
import Loading from './Loading'

export default {
    data: function() {
        return {
            uploadFile: null,
            warmStatus: [0],
            coldIsLoading: null,
            predictionIsLoading:null,
            judgeStatus: "Begin",
            judgeResult: null,
            urls: {
                upload_url: targetURL.upload_url,
                preprocess_url: targetURL.preprocess_url,
                prediction_url: targetURL.prediction_url,
            }
        }
    },
    methods: {
        // modal出力
        show: function() {
            this.$modal.show('result-modal');
        },
        // modal閉じる
        hide: function() {
            this.$modal.hide('result-modal');
        },
        // dataの値のリセット
        reset: function() {
            this.judgeStatus = "Begin",
            this.judgeResult = null
        },

        coldLoading: function() {
            this.coldIsLoading=true;
        },
        predictionLoading: async function() {
            this.predictionIsLoading=true;
        },
        coldFinish: function() {
            this.coldIsLoading=false;
        },
        predictionFinish: function() {
            this.predictionIsLoading=false;
        },

        // バックエンドのlambdaのコンテナを起動させる
        // ライブラリの読み込みに時間のかかる、preprocess/ predictionを対象とする
        // が、しかし、predictionのインポートはやはり遅く、503(API gateway <-> lambdaのタイムアウト)が発生する
        // そのため、503の場合は、再度ユーザーに操作を促す
        warmupLambda: async function() {
            let self = this;
            let preprocessHttpStatusCd = null;
            let predictionHttpStatusCd = null;
            
            // 起動前状態を設定
            self.coldLoading()

            // preprocess, prediction 二つのリクエスト同時に非同期で実行する
            await Promise.all([postTarget(self.urls.preprocess_url), postTarget(self.urls.prediction_url)]).then(
                values => {
                    preprocessHttpStatusCd = values[0];
                    predictionHttpStatusCd = values[1];
                    console.log('warmStatus',this.warmStatus[this.warmStatus.length - 1] )
                }
            )
            self.coldFinish()

            //console.log('predictionHttpStatusCd', predictionHttpStatusCd)
            // console.log('preprocessHttpStatusCd', preprocessHttpStatusCd)

            // timeoutが発生した場合、warmStatusに9を格納
            if (preprocessHttpStatusCd === 503 || predictionHttpStatusCd === 503 || predictionHttpStatusCd === 500) {
                self.warmStatus.push(9);
                console.log(self.warmStatus[self.warmStatus.length - 1])
            }
            // lambdaのコンテナが立ち上がった時、warmStatusに1を格納
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

            // 前回のリクエストの際の処理のdataの値をリセットする
            self.reset()

            // modalオープン
            self.show();

            // ロードを開始する
            self.predictionLoading();

            axios.post(upload_url, targetFile, {
                headers: {
                    "Content-Type": targetFile.type
                }
            }).then(function(res) {
                console.log(res.data);
                if (res.status === 200) {
                    // file upload 完了
                    self.judgeStatus = "Judging ...";
                    const saved_file_path = JSON.parse(JSON.stringify(res.data));
                    console.log(saved_file_path.saved_file_path);
                    axios.post(self.urls.preprocess_url, saved_file_path.saved_file_path,{
                        headers: {
                    "Content-Type": 'application/json'
                }
            }).then(function(res) {
                console.log(res);
                if (res.status === 200) {
                    self.judgeStatus = "Almost Judging...";
                    const output_file_path = JSON.parse(JSON.stringify(res.data));
                    console.log(output_file_path.output_file_path);
                    axios.post(self.urls.prediction_url, output_file_path.output_file_path,{
                        headers: {
                    "Content-Type": 'application/json'
                    }}).then(function(res) {
                        console.log(res);
                        if(res.status === 200) {
                            // ロードを終了する
                            self.predictionFinish();
                            self.judgeStatus = "Finished";
                            const judgeResult = JSON.parse(JSON.stringify(res.data));
                            self.judgeResult = judgeResult.predicted_group;
                        }
                    });
                }
            });
        }
    }
            )}
        },
    components: {
        Modal,
        Loading
    }
}
</script>

<style >


</style>