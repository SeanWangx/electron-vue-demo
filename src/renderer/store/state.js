import storage from '@/utils/storage'

export default {
  accessKey: storage.get('accessKey', ''),
  secretKey: storage.get('secretKey', ''),
  userValid: storage.get('userValid', false)
}
