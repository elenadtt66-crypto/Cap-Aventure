import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function uploadVehicleImage(file: File, vehicleSlug: string): Promise<string> {
  try {
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `vehicles/${vehicleSlug}/${filename}`);
    
    // Uploader le fichier
    const snapshot = await uploadBytes(storageRef, file);
    
    // Récupérer l'URL publique
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading vehicle image:', error);
    throw error;
  }
}
