const STORAGE_KEY = 'senadee_doctors';

const initialDoctors = [
  { id: 1, name: 'dr. Rifqi Rinaldi', specialty: 'Dokter Umum', status: 'active' },
  { id: 2, name: 'dr. Andi Kurniawan, Sp.PD', specialty: 'Penyakit Dalam', status: 'active' },
  { id: 3, name: 'dr. Siti Aminah, Sp.A', specialty: 'Anak', status: 'active' },
];

export function getDoctors() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDoctors));
  return initialDoctors;
}

export function addDoctor(doctor) {
  const doctors = getDoctors();
  const newDoctor = {
    ...doctor,
    id: Date.now(),
  };
  doctors.push(newDoctor);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
  return newDoctor;
}

export function updateDoctor(updatedDoctor) {
  const doctors = getDoctors();
  const index = doctors.findIndex(d => d.id === updatedDoctor.id);
  if (index !== -1) {
    doctors[index] = updatedDoctor;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
    return true;
  }
  return false;
}

export function deleteDoctor(id) {
  const doctors = getDoctors();
  const filtered = doctors.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function toggleDoctorStatus(id) {
  const doctors = getDoctors();
  const index = doctors.findIndex(d => d.id === id);
  if (index !== -1) {
    doctors[index].status = doctors[index].status === 'active' ? 'inactive' : 'active';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
    return true;
  }
  return false;
}

export function resetDoctors() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDoctors));
  return initialDoctors;
}
