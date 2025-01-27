<template>
  <div class="px-4">
    <div class="flex justify-center space-x-4 px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <USelectMenu v-model="selectedColumns" :options="cols" multiple placeholder="Columns" />
      <UPagination v-model="page" :page-count="pageCount" :total="rooms.length" />
      <UButton @click="sendJSON" icon="i-heroicons:document-arrow-up-16-solid">CSV</UButton>
      <UButton @click="reloadPage" icon="i-heroicons:document-arrow-down-20-solid">Odswiez</UButton>
    </div>
    <UTable :rows="rows" :columns="selectedColumns" caption="Pokoje">

    </UTable>
  </div> 
</template>

<script lang="ts" setup>
import type { Floor } from '~/types/floor';
import type { Room } from '~/types/room';
const rooms = ref<Room[]>([])
const page = ref(1)
const pageCount = 15
const rows = computed(() => {
  return rooms.value.slice((page.value -1) * pageCount, (page.value) * pageCount)
})
// get from query
const floorNumber = useRoute().query.floorNumber?.toString() 
const cols = [
  {
    key: 'roomNumber',
    label: "Numer pokoju"
  },
  {
    key: 'informatycy.hasAccessPoint',
    label: "Access Point"
  },
  {
    key: 'informatycy.hasBathPhone',
    label: "Telefon Laz."
  },
  {
    key: 'informatycy.hasPhone',
    label: 'Telefon'
  },
  {
    key: 'informatycy.hasTV',
    label: "Telewizor"
  },
  {
    key: 'informatycy.hasLock',
    label: "Zamek"
  },
  {
    key: 'elektrycy.hasSocket',
    label: "Gniazdka"
  },
  {
    key: "elektrycy.hasBulb",
    label: "Oświetlenie"
  },
  {
    key: "elektrycy.hasFreezer",
    label: "Lodówka"
  },
  {
    key: "elektrycy.hasDryer",
    label: "Suszarka"
  },
  {
    key: 'elektrycy.hasMirror',
    label: "Lusterko"
  },
  {
    key: "elektrycy.hasAC",
    label: "Klimatyzacja"
  },
  {
    key: "konserwatorzy.hasShower",
    label: "Prysznic"
  },
  {
    key: "konserwatorzy.hasToilet",
    label: "Miska WC"
  },
  {
    key: "konserwatorzy.hasRadiator",
    label: "Grzejnik"
  },
  {
    key: "konserwatorzy.hasBidet",
    label: "Bidet"
  },
  {
    key: "konserwatorzy.hasSink",
    label: "Umywalka"
  },
  {
    key: "konserwatorzy.hasDoor",
    label: "Drzwi Wejśćiowe"
  },
  {
    key: "konserwatorzy.hasDrain",
    label: "Kratka Balkon"
  },
  {
    key: "konserwatorzy.hasWallpaper",
    label: "Tapety"
  },
  {
    key: "konserwatorzy.hasTiles",
    label: "Płytki + Fugi"
  },
  {
    key: "konserwatorzy.hasSilicone",
    label: "Sylikony"
  },
  {
    key: "konserwatorzy.hasCeiling",
    label: "Sufit"
  },
  {
    key: "konserwatorzy.hasVent",
    label: "Kratki went."
  },
  {
    key: "konserwatorzy.hasRevisionDoor",
    label: "Drzwickzki rew."
  },
  {
    key: "konserwatorzy.hasToiletDoor",
    label: "Drzwi Toaleta"
  },
  {
    key: "konserwatorzy.hasWindow",
    label: "Okna"
  },
  {
    key: "konserwatorzy.hasCeilingPainting",
    label: "Malowanie Sufitu"
  },
  {
    key: "konserwatorzy.hasKey",
    label: "Kluszę"
  },
  {
    key: "pokojowe.hasCarpet",
    label: "Wykładziny"
  },
  {
    key: "pokojowe.hasBed",
    label: "Meble"
  },
  {
    key: "pokojowe.hasCurtains",
    label: "Firany i Zasłony"
  },
  {
    key: "pokojowe.hasPainting",
    label: "Obrazy"
  },
  {
    key: "pokojowe.hasSafe",
    label: "Sejf"
  },
  {
    key: "pokojowe.hasKettle",
    label: "Czajnik"
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
  const reBuildedRooms = ref([]);
  
  function transformSection(section: any) {
    const keys = Object.keys(section);
    const transformed = {};
    keys.forEach(key => {
      transformed[key] = StatusDecoder(section[key]);
    });
    return transformed;
  }
  
  reBuildedRooms.value = floor.rooms?.map((room: Room) => {
    return {
      roomNumber: room.roomNumber,
      informatycy: transformSection(room.informatycy),
      elektrycy: transformSection(room.elektrycy),
      konserwatorzy: transformSection(room.konserwatorzy),
      pokojowe: transformSection(room.pokojowe),
      administracja: transformSection(room.administracja)
    };
  }) as Room[];
  reBuildedRooms.value = reBuildedRooms.value.sort((a, b) => a.roomNumber - b.roomNumber);
  return reBuildedRooms.value ?? []
}
onMounted(async () => {
  rooms.value = await getRooms()
})
const sendJSON = () => {
  rooms.value = rooms.value.map(room => flattenJSON(room))
  const csv = jsonToCSV(rooms.value)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pokoje.csv';
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
  const colsArr = ['Numer pokoju','Access Point','Telefon Laz.','Telefon','Telewizor','Zamek',"Uwagi Inf.",
                  'Gniazdka','Oświetlenie','Lodówka','Suszarka','Lusterko','Klimatyzacja','Uwagi elek.',
                  'Prysznic','Miska WC','Grzejnik','Bidet','Umywalka','Drzwi Wejśćiowe','Kratka Balkon','Tapety','Płytki + Fugi','Sylikony','Sufit','Kratki went.','Drzwickzki rew.','Drzwi Toaleta','Okna','Malowanie Sufitu','Kluszę','Uwagi Kons.',
                  'Wykładziny','Meble','Firany i Zasłony','Obrazy','Sejf','Czajnik','Uwagi Pok.']
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