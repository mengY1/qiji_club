<template>
    <div></div>
</template>
<script>
import {buildPoster} from '@/utils/api'
export default {
    data(){
        return{

        }
    },
    mounted() {
        var token = ' '
        token += wx.getStorageSync('silentlogin').token
        token = ' eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImZiMzdlZjMwZDc1M2ZiZGQ1NTNiN2FiMjEyMDdkOTdkNzcxZDEyZmViNTBhODBkMTQ1NjNmZTg5YjlmNmM3OTBiN2VhOGFjNmFjYWUzODA2In0.eyJhdWQiOiIxIiwianRpIjoiZmIzN2VmMzBkNzUzZmJkZDU1M2I3YWIyMTIwN2Q5N2Q3NzFkMTJmZWI1MGE4MGQxNDU2M2ZlODliOWY2Yzc5MGI3ZWE4YWM2YWNhZTM4MDYiLCJpYXQiOjE1MzU5NzE4MzQsIm5iZiI6MTUzNTk3MTgzNCwiZXhwIjoxNTY3NTA3ODM0LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.YnpUPnwQWEId-O0A6QPQaQoC3ehf3Xq_CjX498WLjVvNb0pFdbfSKOQbPJsH7WovJP-Hsanx-lluL6iRb-lBRc9mNUHaLCdCwYHWk1iNRF1NOvOup4QhqaVayxmCbXdoZ387XsQJC_jMJ5WBMQX8DOy3zpxZUn5bwXRt3_RawlfEoueXlJUrfxLoi-HnJs5Q0hJj_n0gC7BDStFlFlf0LiDJ156dehPuwhEgBb6_G_i-9aM0WUhVbhyD08iLyG7PuEfIj3-Lgafh4wmFZYDonHi9bTbT-nNMfAl5MTZyG8NCYmLr0GfTBG16odWq27oo6dbocIyCQmIR6JXwvUDsPQR8mk8YFD_ochDoCAecJZGHI4fzHXSQXDocoqcbLu9MGYEEt9nJdumzzlGQzpl3mh5e_XFDaMMydkEkNSQMhhAgrCcT2ge69VQNVhRTxrP0LxH-NmCHrYvt56hvsJ_U--dvqEVYIw67RloNCjq6BE6ipMOOCh-xDifWWZpD04a5xLMge7oVBGIea12Iiz9_Jl-IQqyEEtUraYM2p2ViKyKjp6hJVZ3qdqYbW2iso66XMdACBolaGGb5ohc30xDgU0WA1v-6trVs_QWh166HpcrslGchqZMK-wS29woziK4K0LlQsFvTznTYeIeliLtphowyU3ZSZJLWPwwJRelOCNM'
        var org_claim_id = wx.getStorageSync('org_claim_id')
        buildPoster(org_claim_id,{},token)
    },
}
</script>

