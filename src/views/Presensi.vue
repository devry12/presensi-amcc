<style media="screen">
.fade-enter-active, .fade-leave-active {
transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
opacity: 0;
}
</style>
<template>
<v-card>

  <div v-if="qrcode === true">
    <v-btn color="primary" @click="qrcode = !qrcode" depressed>Manual</v-btn>
  </div>
  <div v-else-if="manual === true">
    <v-btn color="primary" @click="qrcode = !qrcode" depressed>Qrcode</v-btn>
  </div>

    <div v-if="qrcode === true">
      <span v-on="manual = false"></span>
    </div>
    <div v-else-if="manual === true">
      <span v-on="qrcode = false"></span>
    </div>
    <div v-else-if="qrcode === false">
      <span v-on="manual = true"></span>
    </div>
    <div v-else-if="manual === false">
      <span v-on="qrcode = true"></span>
    </div>
  <v-expand-transition >
    <v-layout row wrap mx-2 my-2 v-if="qrcode">
      <v-flex xs6>
        <!-- <v-img src="https://picsum.photos/200/200?random" max-width="200" max-height="200" ></v-img> -->
        <v-alert :value="true" color="error" v-if="error != ''" > {{ error }} </v-alert>
        <p class="decode-result">Last result: <b>{{ result }}</b></p>
        <div class="" style="max-width:200px;">
        <qrcode-stream @decode="onDecode" @init="onInit" />
      </div>
    </v-flex>
    </v-layout>
  </v-expand-transition>

  <v-expand-transition>
    <v-layout row wrap mx-2 my-2 v-if="manual">
      <v-container>
      <v-flex md6>
        <v-text-field name="kode" label="Kode" id="kode" :value="result"></v-text-field>
      </v-flex>
      <v-flex md2>
        <v-btn color="primary" depressed>Ok</v-btn>
      </v-flex>
    </v-container>
    </v-layout>
  </v-expand-transition>

  <v-data-table :headers="headers" :items="presensi"  class="elevation-1" mt-5 >
    <template slot="items"  slot-scope="props">
      <td>{{ props.item.kode }}</td>
      <td>{{ props.item.name }}</td>
      <td>{{ props.item.tlp }}</td>
      <td>{{ props.item.time }}</td>
    </template>
  </v-data-table>

</v-card>

</template>

<script>
import Vue from 'vue';
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import axios from 'axios';
  export default {
    components:{
      QrcodeStream,
      QrcodeDropZone,
      QrcodeCapture,
    },
    created:function() {
      axios.get('https://devry-mytutn.firebaseio.com/.json')
    .then(response => {
      // JSON responses are automatically parsed.
      this.presensi = response.data.user
      console.log(this.presensi);
    })
    .catch(e => {
      this.errors.push(e)
    })

    },
    methods: {
      pushpresensi(){
        axios.post('https://devry-mytutn.firebaseio.com/.json')
      .then(response => {
        // JSON responses are automatically parsed.
        this.presensi = response.data.user
        console.log(this.presensi);
      })
      .catch(e => {
        this.errors.push(e)
      })
    },
    onDecode (result) {
      this.result = result
    },
    logErrors (promise) {
    promise.catch(console.error)
  },
  // addPresensi(){
  //   axios.
  // },

  async onInit (promise) {
        try {
          await promise
        } catch (error) {
          if (error.name === 'NotAllowedError') {
            this.error = "ERROR: you need to grant camera access permisson"
          } else if (error.name === 'NotFoundError') {
            this.error = "ERROR: no camera on this device"
          } else if (error.name === 'NotSupportedError') {
            this.error = "ERROR: secure context required (HTTPS, localhost)"
          } else if (error.name === 'NotReadableError') {
            this.error = "ERROR: is the camera already in use?"
          } else if (error.name === 'OverconstrainedError') {
            this.error = "ERROR: installed cameras are not suitable"
          } else if (error.name === 'StreamApiNotSupportedError') {
            this.error = "ERROR: Stream API is not supported in this browser"
          }
        }
      }

  },
    data () {
      return {
        result: '',
        error: '',
        test:0,
        qrcode:false,
        manual:false,

        headers: [
          {text: 'Kode',sortable: false, value: 'kode'},
          { text: 'Nama', value: 'name' },
          { text: 'No Tlp', value: 'tlp' },
          { text: 'Waktu Presensi', value: 'time' },
        ],
        presensi: []
      }
    }
  }

  // setInterval(()=>{ document.getElementById('autoload').click() },10)
</script>
