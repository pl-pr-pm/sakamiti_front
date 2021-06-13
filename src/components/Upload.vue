<template>
    <div name="upload">
        <div name="start" v-if="this.warmStatus[this.warmStatus.length - 1] != 1">
        <button name="start_button" v-on:click="warmupLambda"> AI 起動 (数分かかる場合があります)
        </button>
        </div>
        <p v-if="this.warmStatus[this.warmStatus.length - 1] == 9"> AI がまだ起動していないようです。再度、診断開始ボタンを押してください。
        </p>
        <div name="button" v-if="this.warmStatus[this.warmStatus.length - 1] == 1">
        <p> あなたの画像をアップロードしてください。<br> </p>
        <input  v-on:change="onFileChange" type="file" name="file" placeholder="Photo from your computer" accept="image/*" required>
        <button v-on:click="uploadImage"> Upload </button>
        </div>
        <Modal :judgeStatus = this.judgeStatus :judgeResult = this.judgeResult>
        </Modal>
    </div>
</template>

<script>
import axios from 'axios';
import {postTarget} from '../util';
import {targetURL} from '../config';
import Modal from './Modal'

export default {
    data: function() {
        return {
            uploadFile: null,
            warmStatus: [0],
            judgeStatus: "審査前",
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
            this.judgeStatus = "審査前",
            this.judgeResult = null
        },
        warmupLambda: async function() {
        // バックエンドのlambdaのコンテナを起動させる
        // ライブラリの読み込みに時間のかかる、preprocess/ predictionを対象とする
        // が、しかし、predictionのインポートはやはり遅く、503(API gateway <-> lambdaのタイムアウト)が発生する
        // そのため、503の場合は、再度ユーザーに操作を促す

            let self = this;
            let preprocessHttpStatusCd = null;
            let predictionHttpStatusCd = null;
            
            // 起動前状態を設定
            self.warmStatus.push(0);
            // preprocess, prediction 二つのリクエスト同時に非同期で実行する
            await Promise.all([postTarget(self.urls.preprocess_url), postTarget(self.urls.prediction_url)]).then(
                values => {
                    preprocessHttpStatusCd = values[0];
                    predictionHttpStatusCd = values[1];
                    console.log('predictionHttpStatusCd', predictionHttpStatusCd)
                }
            )

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
                        if(res.status === 200) {
                            self.judgeStatus = "審査が完了しました";
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
        Modal
    }
}
</script>

<style >


</style>