import api from '@/api'
import { useDrawStore } from '@/store'

const drawStore = useDrawStore()
const initLoadingDate = new Date(1970, 1, 1)
let beginLoading: Date = new Date(1970, 1, 1)

export async function checkProcess(uuid: string) {
  // eslint-disable-next-line no-console
  console.log(`checkProcess222:${uuid}`)
  if (beginLoading.getTime() !== initLoadingDate.getTime() && new Date().getTime() - beginLoading.getTime() * 1000 > 25 * 1000) {
    drawStore.setLoading(false)
    drawStore.setLoadingUuid('')
    beginLoading = initLoadingDate
    return
  }
  beginLoading = new Date()
  const imageResp = await api.fetchAiImage<Chat.AiImageItem>(uuid)
  // drawStore.updateAiImage(uuid, imageResp.data)
  // drawStore.setLoading(false)
  // drawStore.setLoadingUuid('')
  if (imageResp.code === 200) {
    drawStore.updateAiImage(uuid, imageResp.data)
    drawStore.setLoading(false)
    drawStore.setLoadingUuid('')
  }
}
