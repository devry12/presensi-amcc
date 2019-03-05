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
        <v-text-field name="kode" label="Kode" v-model="result" id="kode" :value="result"></v-text-field>
      </v-flex>
      <v-flex md2>
        <v-btn color="primary" @click="pushpresensi()" depressed>Ok</v-btn>
      </v-flex>
    </v-container>
    </v-layout>
  </v-expand-transition>

  <v-data-table :headers="headers" :items="presensi"  class="elevation-1" mt-5 >
    <template slot="items"  slot-scope="props">
      <td>{{ props.item.id_peserta }}</td>
      <td>{{ props.item.nama_peserta }}</td>
      <td>{{ props.item.telepon_peserta }}</td>
      <td>{{ props.item.jam_hadir }}</td>
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
    // mounted(){
    //   console.log('afasf');
    //   var channel = this.$pusher.subscribe('notif-chennel');
    //   channel.bind('my-event',function(data){
    //     console.log("test 1 "+data.kode)
    //   })
    // },
    created:function() {
      axios.get('http://localhost:9090/api/v1/presensi')
    .then(response => {
      // JSON responses are automatically parsed.
      this.presensi = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })

    },
    methods: {
      testpush(){
        axios.post("http://localhost:90/",{
          kode:this.result,
          name:"rika",
          tlp:"3000000"
        }).then((response) => {
          console.log(response.data);
      })

      console.log(result);

        var channel = this.$pusher.subscribe('notif-chennel');
        channel.bind('my-event',function(data){
          console.log("test 2 "+data.kode)
          console.log("test 2 "+data.name)
          console.log("test 2 "+data.tlp)
        })
      },
      pushpresensi(){
        var audios = new Audio('../assets/beep.mp3');
        audios.play();
        var fd = new FormData();
        fd.append('id_peserta',this.result)
        axios.post("http://localhost:9090/api/v1/presensi",fd).then((response) => {
          if (response.data.message == 'berhasil') {
            console.log(response);
          this.presensi.push(response.data)
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'success',
            title: 'Presensi berhasil'
          })
          this.result = ""
        }else if (response.data.message == 'sudah') {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'error',
            title: 'anda sudah presensi'
          })
          this.result = ""

        }else if (response.data.message == 'tidakada') {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'error',
            title: 'Maaf anda tidak terdaftar sebagai peserta'
          })
          this.result = ""


        }
}).catch(e => {
        this.errors.push(e)
      })
    },
    onDecode (result) {
      this.result = result
      this.pushpresensi()
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
