import {
  type User, 
  type InsertUser, 
  type Patient, 
  type InsertPatient,
  type Doctor, 
  type InsertDoctor,
  type Appointment,
  type InsertAppointment,
  type MedicalRecord,
  type InsertMedicalRecord,
  type Billing,
  type InsertBilling,
  type HospitalResource,
  type InsertHospitalResource,
  type DashboardStats
} from "@shared/schema";

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${random}`.toUpperCase();
}

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Patients
  getAllPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByPatientId(patientId: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(patientId: string, patient: Partial<InsertPatient>): Promise<Patient | undefined>;
  deletePatient(patientId: string): Promise<boolean>;

  // Doctors
  getAllDoctors(): Promise<Doctor[]>;
  getDoctor(id: number): Promise<Doctor | undefined>;
  getDoctorByDoctorId(doctorId: string): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  updateDoctor(doctorId: string, doctor: Partial<InsertDoctor>): Promise<Doctor | undefined>;
  deleteDoctor(doctorId: string): Promise<boolean>;

  // Appointments
  getAllAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentByAppointmentId(appointmentId: string): Promise<Appointment | undefined>;
  getAppointmentsByPatientId(patientId: string): Promise<Appointment[]>;
  getAppointmentsByDoctorId(doctorId: string): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(appointmentId: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(appointmentId: string): Promise<boolean>;

  // Medical Records
  getAllMedicalRecords(): Promise<MedicalRecord[]>;
  getMedicalRecord(id: number): Promise<MedicalRecord | undefined>;
  getMedicalRecordByRecordId(recordId: string): Promise<MedicalRecord | undefined>;
  getMedicalRecordsByPatientId(patientId: string): Promise<MedicalRecord[]>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  updateMedicalRecord(recordId: string, record: Partial<InsertMedicalRecord>): Promise<MedicalRecord | undefined>;
  deleteMedicalRecord(recordId: string): Promise<boolean>;

  // Billings
  getAllBillings(): Promise<Billing[]>;
  getBilling(id: number): Promise<Billing | undefined>;
  getBillingByBillingId(billingId: string): Promise<Billing | undefined>;
  getBillingsByPatientId(patientId: string): Promise<Billing[]>;
  createBilling(billing: InsertBilling): Promise<Billing>;
  updateBilling(billingId: string, billing: Partial<InsertBilling>): Promise<Billing | undefined>;
  deleteBilling(billingId: string): Promise<boolean>;

  // Hospital Resources
  getAllHospitalResources(): Promise<HospitalResource[]>;
  getHospitalResource(id: number): Promise<HospitalResource | undefined>;
  getHospitalResourceByName(resourceName: string): Promise<HospitalResource | undefined>;
  createHospitalResource(resource: InsertHospitalResource): Promise<HospitalResource>;
  updateHospitalResource(id: number, resource: Partial<InsertHospitalResource>): Promise<HospitalResource | undefined>;
  deleteHospitalResource(id: number): Promise<boolean>;

  // Dashboard Statistics
  getDashboardStats(): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private patients: Map<number, Patient>;
  private doctors: Map<number, Doctor>;
  private appointments: Map<number, Appointment>;
  private medicalRecords: Map<number, MedicalRecord>;
  private billings: Map<number, Billing>;
  private hospitalResources: Map<number, HospitalResource>;
  
  currentUserId: number;
  currentPatientId: number;
  currentDoctorId: number;
  currentAppointmentId: number;
  currentMedicalRecordId: number;
  currentBillingId: number;
  currentHospitalResourceId: number;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.doctors = new Map();
    this.appointments = new Map();
    this.medicalRecords = new Map();
    this.billings = new Map();
    this.hospitalResources = new Map();
    
    this.currentUserId = 1;
    this.currentPatientId = 1;
    this.currentDoctorId = 1;
    this.currentAppointmentId = 1;
    this.currentMedicalRecordId = 1;
    this.currentBillingId = 1;
    this.currentHospitalResourceId = 1;
    
    this.seedData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Patients
  async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientByPatientId(patientId: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.patientId === patientId
    );
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.currentPatientId++;
    const patientId = insertPatient.patientId || generateId('PT');
    const createdAt = new Date().toISOString();
    const patient: Patient = { ...insertPatient, id, patientId, createdAt };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(patientId: string, updateData: Partial<InsertPatient>): Promise<Patient | undefined> {
    const patient = await this.getPatientByPatientId(patientId);
    if (!patient) return undefined;

    const updatedPatient: Patient = { ...patient, ...updateData };
    this.patients.set(patient.id, updatedPatient);
    return updatedPatient;
  }

  async deletePatient(patientId: string): Promise<boolean> {
    const patient = await this.getPatientByPatientId(patientId);
    if (!patient) return false;
    
    return this.patients.delete(patient.id);
  }

  // Doctors
  async getAllDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async getDoctorByDoctorId(doctorId: string): Promise<Doctor | undefined> {
    return Array.from(this.doctors.values()).find(
      (doctor) => doctor.doctorId === doctorId
    );
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = this.currentDoctorId++;
    const doctorId = insertDoctor.doctorId || generateId('DR');
    const createdAt = new Date().toISOString();
    const doctor: Doctor = { ...insertDoctor, id, doctorId, createdAt };
    this.doctors.set(id, doctor);
    return doctor;
  }

  async updateDoctor(doctorId: string, updateData: Partial<InsertDoctor>): Promise<Doctor | undefined> {
    const doctor = await this.getDoctorByDoctorId(doctorId);
    if (!doctor) return undefined;

    const updatedDoctor: Doctor = { ...doctor, ...updateData };
    this.doctors.set(doctor.id, updatedDoctor);
    return updatedDoctor;
  }

  async deleteDoctor(doctorId: string): Promise<boolean> {
    const doctor = await this.getDoctorByDoctorId(doctorId);
    if (!doctor) return false;
    
    return this.doctors.delete(doctor.id);
  }

  // Appointments
  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointmentByAppointmentId(appointmentId: string): Promise<Appointment | undefined> {
    return Array.from(this.appointments.values()).find(
      (appointment) => appointment.appointmentId === appointmentId
    );
  }

  async getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.patientId === patientId
    );
  }

  async getAppointmentsByDoctorId(doctorId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.doctorId === doctorId
    );
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.date === date
    );
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId++;
    const appointmentId = insertAppointment.appointmentId || generateId('AP');
    const createdAt = new Date().toISOString();
    const appointment: Appointment = { ...insertAppointment, id, appointmentId, createdAt };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(appointmentId: string, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const appointment = await this.getAppointmentByAppointmentId(appointmentId);
    if (!appointment) return undefined;

    const updatedAppointment: Appointment = { ...appointment, ...updateData };
    this.appointments.set(appointment.id, updatedAppointment);
    return updatedAppointment;
  }

  async deleteAppointment(appointmentId: string): Promise<boolean> {
    const appointment = await this.getAppointmentByAppointmentId(appointmentId);
    if (!appointment) return false;
    
    return this.appointments.delete(appointment.id);
  }

  // Medical Records
  async getAllMedicalRecords(): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values());
  }

  async getMedicalRecord(id: number): Promise<MedicalRecord | undefined> {
    return this.medicalRecords.get(id);
  }

  async getMedicalRecordByRecordId(recordId: string): Promise<MedicalRecord | undefined> {
    return Array.from(this.medicalRecords.values()).find(
      (record) => record.recordId === recordId
    );
  }

  async getMedicalRecordsByPatientId(patientId: string): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values()).filter(
      (record) => record.patientId === patientId
    );
  }

  async createMedicalRecord(insertRecord: InsertMedicalRecord): Promise<MedicalRecord> {
    const id = this.currentMedicalRecordId++;
    const recordId = insertRecord.recordId || generateId('MR');
    const createdAt = new Date().toISOString();
    const record: MedicalRecord = { ...insertRecord, id, recordId, createdAt };
    this.medicalRecords.set(id, record);
    return record;
  }

  async updateMedicalRecord(recordId: string, updateData: Partial<InsertMedicalRecord>): Promise<MedicalRecord | undefined> {
    const record = await this.getMedicalRecordByRecordId(recordId);
    if (!record) return undefined;

    const updatedRecord: MedicalRecord = { ...record, ...updateData };
    this.medicalRecords.set(record.id, updatedRecord);
    return updatedRecord;
  }

  async deleteMedicalRecord(recordId: string): Promise<boolean> {
    const record = await this.getMedicalRecordByRecordId(recordId);
    if (!record) return false;
    
    return this.medicalRecords.delete(record.id);
  }

  // Billings
  async getAllBillings(): Promise<Billing[]> {
    return Array.from(this.billings.values());
  }

  async getBilling(id: number): Promise<Billing | undefined> {
    return this.billings.get(id);
  }

  async getBillingByBillingId(billingId: string): Promise<Billing | undefined> {
    return Array.from(this.billings.values()).find(
      (billing) => billing.billingId === billingId
    );
  }

  async getBillingsByPatientId(patientId: string): Promise<Billing[]> {
    return Array.from(this.billings.values()).filter(
      (billing) => billing.patientId === patientId
    );
  }

  async createBilling(insertBilling: InsertBilling): Promise<Billing> {
    const id = this.currentBillingId++;
    const billingId = insertBilling.billingId || generateId('BL');
    const createdAt = new Date().toISOString();
    const billing: Billing = { ...insertBilling, id, billingId, createdAt };
    this.billings.set(id, billing);
    return billing;
  }

  async updateBilling(billingId: string, updateData: Partial<InsertBilling>): Promise<Billing | undefined> {
    const billing = await this.getBillingByBillingId(billingId);
    if (!billing) return undefined;

    const updatedBilling: Billing = { ...billing, ...updateData };
    this.billings.set(billing.id, updatedBilling);
    return updatedBilling;
  }

  async deleteBilling(billingId: string): Promise<boolean> {
    const billing = await this.getBillingByBillingId(billingId);
    if (!billing) return false;
    
    return this.billings.delete(billing.id);
  }

  // Hospital Resources
  async getAllHospitalResources(): Promise<HospitalResource[]> {
    return Array.from(this.hospitalResources.values());
  }

  async getHospitalResource(id: number): Promise<HospitalResource | undefined> {
    return this.hospitalResources.get(id);
  }

  async getHospitalResourceByName(resourceName: string): Promise<HospitalResource | undefined> {
    return Array.from(this.hospitalResources.values()).find(
      (resource) => resource.resourceName === resourceName
    );
  }

  async createHospitalResource(insertResource: InsertHospitalResource): Promise<HospitalResource> {
    const id = this.currentHospitalResourceId++;
    const lastUpdated = new Date().toISOString();
    const resource: HospitalResource = { ...insertResource, id, lastUpdated };
    this.hospitalResources.set(id, resource);
    return resource;
  }

  async updateHospitalResource(id: number, updateData: Partial<InsertHospitalResource>): Promise<HospitalResource | undefined> {
    const resource = await this.getHospitalResource(id);
    if (!resource) return undefined;

    const lastUpdated = new Date().toISOString();
    const updatedResource: HospitalResource = { ...resource, ...updateData, lastUpdated };
    this.hospitalResources.set(id, updatedResource);
    return updatedResource;
  }

  async deleteHospitalResource(id: number): Promise<boolean> {
    return this.hospitalResources.delete(id);
  }

  // Dashboard Statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = (await this.getAppointmentsByDate(today)).length;
    
    return {
      todayAppointments: todayAppointments || 24,
      admittedPatients: 137,
      availableDoctors: 8,
      todayRevenue: 9834,
      occupancyRate: 85,
      onLeaveCount: 2,
      weekChange: 8.2
    };
  }

  // Seed initial data for the system
  private async seedData() {
    // Create default admin user
    await this.createUser({
      username: "admin",
      password: "admin123",
      role: "admin",
      name: "System Administrator",
      email: "admin@medicare.com"
    });

    // Create a doctor user
    await this.createUser({
      username: "drjohnson",
      password: "doctor123",
      role: "doctor",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@medicare.com",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
    });

    // Create hospital resources
    await this.createHospitalResource({
      resourceName: "beds",
      totalCount: 160,
      usedCount: 137
    });

    await this.createHospitalResource({
      resourceName: "icu",
      totalCount: 20,
      usedCount: 16
    });

    await this.createHospitalResource({
      resourceName: "operating-rooms",
      totalCount: 6,
      usedCount: 3
    });

    await this.createHospitalResource({
      resourceName: "ventilators",
      totalCount: 30,
      usedCount: 12
    });

    // Create sample doctors
    const michaelBrown = await this.createDoctor({
      doctorId: "DR1001",
      name: "Dr. Michael Brown",
      specialization: "Cardiology",
      email: "michael.brown@medicare.com",
      phone: "555-123-4567",
      department: "Cardiology"
    });

    const sarahJohnson = await this.createDoctor({
      doctorId: "DR1002",
      name: "Dr. Sarah Johnson",
      specialization: "General Medicine",
      email: "sarah.johnson@medicare.com",
      phone: "555-123-4568",
      department: "General"
    });

    const amandaRodriguez = await this.createDoctor({
      doctorId: "DR1003",
      name: "Dr. Amanda Rodriguez",
      specialization: "Orthopedics",
      email: "amanda.rodriguez@medicare.com",
      phone: "555-123-4569",
      department: "Orthopedics"
    });

    const jamesWilson = await this.createDoctor({
      doctorId: "DR1004",
      name: "Dr. James Wilson",
      specialization: "Neurology",
      email: "james.wilson@medicare.com",
      phone: "555-123-4570",
      department: "Neurology"
    });

    // Create sample patients
    const emmaWilson = await this.createPatient({
      patientId: "PT10834",
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      phone: "555-234-5678",
      dateOfBirth: "1985-06-15",
      gender: "Female",
      bloodType: "A+"
    });

    const robertMartinez = await this.createPatient({
      patientId: "PT10567",
      name: "Robert Martinez",
      email: "robert.martinez@example.com",
      phone: "555-234-5679",
      dateOfBirth: "1978-12-03",
      gender: "Male",
      bloodType: "O-"
    });

    const davidLee = await this.createPatient({
      patientId: "PT10982",
      name: "David Lee",
      email: "david.lee@example.com",
      phone: "555-234-5680",
      dateOfBirth: "1990-04-22",
      gender: "Male",
      bloodType: "B+"
    });

    const mariaGarcia = await this.createPatient({
      patientId: "PT10742",
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "555-234-5681",
      dateOfBirth: "1983-09-28",
      gender: "Female",
      bloodType: "AB-"
    });

    const jenniferAnderson = await this.createPatient({
      patientId: "PT10456",
      name: "Jennifer Anderson",
      email: "jennifer.anderson@example.com",
      phone: "555-234-5682",
      dateOfBirth: "1975-05-10",
      gender: "Female",
      bloodType: "O+"
    });

    const thomasWright = await this.createPatient({
      patientId: "PT10789",
      name: "Thomas Wright",
      email: "thomas.wright@example.com",
      phone: "555-234-5683",
      dateOfBirth: "1992-11-18",
      gender: "Male",
      bloodType: "A-"
    });

    const sophiaKim = await this.createPatient({
      patientId: "PT10654",
      name: "Sophia Kim",
      email: "sophia.kim@example.com",
      phone: "555-234-5684",
      dateOfBirth: "1988-07-31",
      gender: "Female",
      bloodType: "B-"
    });

    const aliceChen = await this.createPatient({
      patientId: "PT10321",
      name: "Alice Chen",
      email: "alice.chen@example.com",
      phone: "555-234-5685",
      dateOfBirth: "1995-02-14",
      gender: "Female",
      bloodType: "AB+"
    });

    // Create sample appointments
    const today = new Date().toISOString().split('T')[0];
    
    await this.createAppointment({
      appointmentId: "AP1001",
      patientId: emmaWilson.patientId,
      doctorId: michaelBrown.doctorId,
      date: today,
      time: "10:30",
      status: "confirmed",
      notes: "Regular checkup"
    });

    await this.createAppointment({
      appointmentId: "AP1002",
      patientId: robertMartinez.patientId,
      doctorId: sarahJohnson.doctorId,
      date: today,
      time: "11:15",
      status: "waiting",
      notes: "Follow-up consultation"
    });

    await this.createAppointment({
      appointmentId: "AP1003",
      patientId: davidLee.patientId,
      doctorId: amandaRodriguez.doctorId,
      date: today,
      time: "13:00",
      status: "in-progress",
      notes: "Post-surgery checkup"
    });

    await this.createAppointment({
      appointmentId: "AP1004",
      patientId: mariaGarcia.patientId,
      doctorId: jamesWilson.doctorId,
      date: today,
      time: "14:30",
      status: "confirmed",
      notes: "Neurological assessment"
    });

    // Create sample medical records
    await this.createMedicalRecord({
      recordId: "MR1001",
      patientId: emmaWilson.patientId,
      doctorId: michaelBrown.doctorId,
      date: "2023-10-01",
      diagnosis: "Hypertension",
      treatment: "Prescribed lisinopril 10mg daily",
      medications: "Lisinopril 10mg",
      notes: "Patient reported occasional headaches"
    });

    await this.createMedicalRecord({
      recordId: "MR1002",
      patientId: robertMartinez.patientId,
      doctorId: sarahJohnson.doctorId,
      date: "2023-10-05",
      diagnosis: "Upper respiratory infection",
      treatment: "Prescribed antibiotics for 7 days",
      medications: "Amoxicillin 500mg",
      notes: "Follow up if symptoms persist"
    });

    // Create sample billings
    await this.createBilling({
      billingId: "BL1001",
      patientId: emmaWilson.patientId,
      date: "2023-10-16",
      description: "Insurance claim processed",
      amount: "1850.00",
      status: "paid",
      paymentMethod: "Insurance",
      insuranceInfo: "BlueCross #12345"
    });

    await this.createBilling({
      billingId: "BL1002",
      patientId: davidLee.patientId,
      date: "2023-10-15",
      description: "Payment pending",
      amount: "732.50",
      status: "pending",
      paymentMethod: "Credit Card",
      insuranceInfo: "Aetna #54321"
    });

    await this.createBilling({
      billingId: "BL1003",
      patientId: thomasWright.patientId,
      date: "2023-10-15",
      description: "Claim rejected",
      amount: "1245.00",
      status: "pending",
      paymentMethod: "Insurance",
      insuranceInfo: "United #67890"
    });

    await this.createBilling({
      billingId: "BL1004",
      patientId: aliceChen.patientId,
      date: "2023-10-14",
      description: "Invoice generated",
      amount: "578.25",
      status: "pending",
      paymentMethod: "Cash",
      insuranceInfo: ""
    });
  }
}

export const storage = new MemStorage();
