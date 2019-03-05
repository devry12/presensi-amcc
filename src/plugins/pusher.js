import Vue from 'vue'
import Pusher from 'vue-pusher'

Vue.use(Pusher, {
    api_key: '74d4f0df4754ea5a1324',
    options: {
        cluster: 'ap1',
        encrypted: true,
    }
});
