<script setup>
import ProgressBarWidgetVue from "@/components/ProgressBarWidget.vue"
import apiService from "@/services/apiService"
import axios from "axios"
import { onMounted, reactive } from 'vue'

const zones = reactive({ list: [] })
// const router = useRouter()

const getAllZone = () => {
  axios({
    url: apiService.getUrl() + '/preventive',
    method: 'GET'
  })
    .then((response) => {
      zones.list = response.data
      console.log('Response zone ', zones.list)

      for (const i in zones.list) {
        console.log('-yçççç ', zones.list[i].zone)
        switch (zones.list[i].zone) {
          case 'KARA EST':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=KARA EST',
              method: 'GET'
            }).then((res) => {
              number.ke = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'LOME OUEST 2':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=LOME OUEST 2',
              method: 'GET'
            }).then((res) => {
              number.lo2 = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'LOME OUEST 1':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=LOME OUEST 1',
              method: 'GET'
            }).then((res) => {
              number.lo1 = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'LOME EST':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=LOME EST',
              method: 'GET'
            }).then((res) => {
              number.le = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'KPALIME':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=KPALIME',
              method: 'GET'
            }).then((res) => {
              number.kpa = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'BLITTA':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=BLITTA',
              method: 'GET'
            }).then((res) => {
              number.bli = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'KARA OUEST':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=KARA OUEST',
              method: 'GET'
            }).then((res) => {
              number.ko = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'ATAKPAME':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=ATAKPAME',
              method: 'GET'
            }).then((res) => {
              number.at = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'TSEVIE':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=TSEVIE',
              method: 'GET'
            }).then((res) => {
              number.tse = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'KANTE':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=KANTE',
              method: 'GET'
            }).then((res) => {
              number.kan = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'NOTSE':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=NOTSE',
              method: 'GET'
            }).then((res) => {
              number.not = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'LOME NORD':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=LOME NORD',
              method: 'GET'
            }).then((res) => {
              number.ln = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'BADOU':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=BADOU',
              method: 'GET'
            }).then((res) => {
              number.bad = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'BASSAR':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=BASSAR',
              method: 'GET'
            }).then((res) => {
              number.bass = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'LOME SUD':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=LOME SUD',
              method: 'GET'
            }).then((res) => {
              number.ls = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'DAPAONG':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=DAPAONG',
              method: 'GET'
            }).then((res) => {
              number.dap = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'LOME CENTRE':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=LOME CENTRE',
              method: 'GET'
            }).then((res) => {
              number.lc = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'SOKODE':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=SOKODE',
              method: 'GET'
            }).then((res) => {
              number.sok = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'ANEHO':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=ANEHO',
              method: 'GET'
            }).then((res) => {
              number.ane = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'MANGO':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=MANGO',
              method: 'GET'
            }).then((res) => {
              number.man = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
          case 'TCHAMBA':
            axios({
              url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=TCHAMBA',
              method: 'GET'
            }).then((res) => {
              number.tcham = res.data[0].nb
              console.log('\nkara est = ' + res.data)

            }).catch((err) => {
              console.log('An error occured ' + err.message)
            })
            break;
        }
      }


    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

const number = reactive({
  ke: '',
  lo2: '',
  lo1: '',
  le: '',
  kpa: '',
  bli: '',
  ko: '',
  at: '',
  tse: '',
  kan: '',
  not: '',
  ln: '',
  bad: '',
  bass: '',
  ls: '',
  dap: '',
  lc: '',
  sok: '',
  ane: '',
  man: '',
  tcham: ''
})
const siteDone = (zone) => {
  console.log('\nzone = ' + zone)
  axios({
    url: apiService.getUrl() + '/plannifie/zone/done/nb?zone=' + zone,
    method: 'GET'
  }).then((res) => {
    number.ke = res.data[0].nb
    console.log('\njijji = ' + res.data)

  }).catch((err) => {
    console.log('An error occured ' + err.message)
  })
}

onMounted(() => {
  getAllZone()
})
</script>
<template>
  <div class="max-h-[32rem] overflow-x-auto">
    <table>
      <thead>
        <tr>
          <th v-if="checkable" />
          <th />
          <th>Zone</th>
          <th>Progression</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(site, index) in zones.list" :key="index">
          <TableCheckboxCell v-if="checkable" @checked="checked($event, site)" />
          <td class="border-b-0 lg:w-6 before:hidden">
            <!-- <UserAvatar :username="site.nom_site" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
          </td>
          <td data-label="Zone">
            {{ site.zone }}
            <div v-if="site.zone === 'KARA EST'">
              ( {{ number.ke }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'KARA OUEST'">
              ( {{ number.ko }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'DAPAONG'">
              ( {{ number.dap }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'MANGO'">
              ( {{ number.man }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'KANTE'">
              ( {{ number.kan }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'TCHAMBA'">
              ( {{ number.tcham }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'BADOU'">
              ( {{ number.bad }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'BASSAR'">
              ( {{ number.bass }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'BLITTA'">
              ( {{ number.bli }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'LOME OUEST 2'">
              ( {{ number.lo2 }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'LOME OUEST 1'">
              ( {{ number.lo1 }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'LOME EST'">
              ( {{ number.le }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'KPALIME'">
              ( {{ number.kpa }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'ATAKPAME'">
              ( {{ number.at }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'TSEVIE'">
              ( {{ number.tse }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'NOTSE'">
              ( {{ number.not }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'LOME NORD'">
              ( {{ number.ln }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'LOME SUD'">
              ( {{ number.ls }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'LOME CENTRE'">
              ( {{ number.lc }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'SOKODE'">
              ( {{ number.sok }} /{{ site.nombre_total_site }})
            </div>
            <div v-else-if="site.zone === 'ANEHO'">
              ( {{ number.ane }} /{{ site.nombre_total_site }})
            </div>
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">

            <div v-if="site.zone === 'KARA EST'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.ke) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'KARA OUEST'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.ko) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'DAPAONG'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.dap) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'MANGO'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.man) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'KANTE'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.kan) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'TCHAMBA'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.tcham) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'BADOU'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.bad) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'BASSAR'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.bass) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'BLITTA'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.bli) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'LOME OUEST 2'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.lo2) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'LOME OUEST 1'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.lo1) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'LOME EST'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.le) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'KPALIME'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.kpa) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'ATAKPAME'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.at) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'TSEVIE'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.tse) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'NOTSE'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.not) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'LOME NORD'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.ln) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'LOME SUD'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.ls) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'LOME CENTRE'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.lc) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'SOKODE'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.sok) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
            <div v-else-if="site.zone === 'ANEHO'">
              <ProgressBarWidgetVue :value="Math.ceil(parseInt(number.ane) * 100 / parseInt(site.nombre_total_site))"
                :maxValue="100" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style></style>
