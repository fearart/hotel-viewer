<template>
  <div class="px-4">
    <div class="flex justify-center space-x-4 px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <USelectMenu v-model="selectedColumns" :options="cols" multiple placeholder="Columns" />
      <UPagination v-model="page" :page-count="pageCount" :total="corridors.length" />
      <UButton @click="sendJSON" icon="i-heroicons:document-arrow-up-16-solid">CSV</UButton>
      <UButton @click="reloadPage" icon="i-heroicons:document-arrow-down-20-solid">Odswiez</UButton>
    </div>
    <UTable :rows="rows" :columns="selectedColumns" caption="Pokoje">

    </UTable>
  </div> 
</template>

<script lang="ts" setup>
import type { Floor } from '~/types/floor';
import type { Corridor } from '~/types/corridor';
const corridors = ref<Corridor[]>([])
const page = ref(1)
const pageCount = 15
const rows = computed(() => {
  return corridors.value.slice((page.value -1) * pageCount, (page.value) * pageCount)
})
// get from query
const floorNumber = useRoute().query.floorNumber?.toString() 
const cols = [
  {
    key: "corridorNumber",
    label: "Numer pokoju obok"
  },
  {
    key: "informatycy.hasAccessPoint",
    label: "Access Point"
  },
  {
    key: "elektrycy.hasBulb",
    label: "Oświetlenie"
  },
  {
    key: "elektrycy.hasSocket",
    label: "Gniazdka"
  }
]
const selectedColumns = ref([...cols])

const StatusDecoder = (status: string) => {
  if (status === 'Yes') return 'OK'
  if (status === 'No') return 'Błąd'
  if (status === 'unknown') return "Niema"
  return status
}
const getRooms = async () => {
  const response = await $fetch('/api/floors')
  if (!response) return []
  const floors = response.body as Floor[];
  const floor = floors.find((floor: Floor) => String(floor.floor_number) === floorNumber)  
  const reBuildedCorridor = ref([]);
  
  function transformSection(section: any) {
    const keys = Object.keys(section);
    const transformed = {};
    keys.forEach(key => {
      transformed[key] = StatusDecoder(section[key]);
    });
    return transformed;
  }
  
  reBuildedCorridor.value = floor?.corridor?.map((corridor: Corridor) => {
    return {
      corridorNumber: corridor.corridorNumber,
      informatycy: transformSection(corridor.informatycy),
      elektrycy: transformSection(corridor.elektrycy),
    };
  }) as Corridor[];
  reBuildedCorridor.value = reBuildedCorridor.value.sort((a: Corridor, b: Corridor) => a.corridorNumber - b.corridorNumber);
  return reBuildedCorridor.value ?? []
}
onMounted(async () => {
  corridors.value = await getRooms()
})
const sendJSON = () => {
  corridors.value = corridors.value.map(corridor => flattenJSON(corridor))
  const csv = jsonToCSV(corridors.value)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'korytarze.csv';
  a.click();
  URL.revokeObjectURL(url);
}
function flattenJSON(obj: any, parentKey = '', result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !key.endsWith('_id') && !key.endsWith('macAddress') && !key.startsWith('administracja')){
      const newKey = parentKey ? `${parentKey}_${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenJSON(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}
function jsonToCSV(flattenedJSON) {
  const headers = Object.keys(flattenedJSON[0]);
  const csvRows = [];

  // Add headers and rows
  const colsArr = ['Numer pokoju obok','Access Point',"Uwagi Inf.",
                  'Gniazdka','Oświetlenie','Uwagi elek.']
  csvRows.push(colsArr.join(','));
  for (const obj of flattenedJSON) {
    const values = headers.map(header => JSON.stringify(obj[header], replacer));
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

function replacer(key, value) {
  if (value === null) {
    return '';
  }
  return value;
}
const reloadPage = () => {
  location.reload()
}
function uniteComments(Ecomment: String, Kcomment: String,Icomment: String,Pcomment: String) {
  const totalString = `${Ecomment} | ${Kcomment} | ${Icomment} | ${Pcomment}`.replaceAll('\n','')
}
</script>

<style>

</style>