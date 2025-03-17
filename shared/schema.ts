import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("staff"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Patient schema
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  bloodType: text("blood_type"),
  emergencyContact: text("emergency_contact"),
  allergies: text("allergies"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

// Doctor schema
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  doctorId: text("doctor_id").notNull().unique(),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  email: text("email"),
  phone: text("phone"),
  department: text("department"),
  availability: jsonb("availability"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
  createdAt: true,
});

// Appointment schema
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  appointmentId: text("appointment_id").notNull().unique(),
  patientId: text("patient_id").notNull().references(() => patients.patientId),
  doctorId: text("doctor_id").notNull().references(() => doctors.doctorId),
  date: text("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull().default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

// Medical Record schema
export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  recordId: text("record_id").notNull().unique(),
  patientId: text("patient_id").notNull().references(() => patients.patientId),
  doctorId: text("doctor_id").notNull().references(() => doctors.doctorId),
  date: text("date").notNull(),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  medications: text("medications"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  createdAt: true,
});

// Billing schema
export const billings = pgTable("billings", {
  id: serial("id").primaryKey(),
  billingId: text("billing_id").notNull().unique(),
  patientId: text("patient_id").notNull().references(() => patients.patientId),
  date: text("date").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount").notNull(),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method"),
  insuranceInfo: text("insurance_info"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBillingSchema = createInsertSchema(billings).omit({
  id: true,
  createdAt: true,
});

// Hospital Resources schema
export const hospitalResources = pgTable("hospital_resources", {
  id: serial("id").primaryKey(),
  resourceName: text("resource_name").notNull(),
  totalCount: integer("total_count").notNull(),
  usedCount: integer("used_count").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertHospitalResourceSchema = createInsertSchema(hospitalResources).omit({
  id: true,
  lastUpdated: true,
});

// Define the exported types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;

export type Billing = typeof billings.$inferSelect;
export type InsertBilling = z.infer<typeof insertBillingSchema>;

export type HospitalResource = typeof hospitalResources.$inferSelect;
export type InsertHospitalResource = z.infer<typeof insertHospitalResourceSchema>;

// Types for statistics and dashboard
export const dashboardStatsSchema = z.object({
  todayAppointments: z.number(),
  admittedPatients: z.number(),
  availableDoctors: z.number(),
  todayRevenue: z.number(),
  occupancyRate: z.number(),
  onLeaveCount: z.number(),
  weekChange: z.number(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

// Appointment status type
export const appointmentStatusSchema = z.enum([
  "scheduled",
  "confirmed",
  "checking-in",
  "in-progress",
  "completed",
  "cancelled",
  "no-show",
  "waiting"
]);

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;

// Billing status type
export const billingStatusSchema = z.enum([
  "pending",
  "paid",
  "partially-paid",
  "overdue",
  "cancelled",
  "refunded"
]);

export type BillingStatus = z.infer<typeof billingStatusSchema>;

// Resource types
export const resourceTypeSchema = z.enum([
  "beds",
  "icu",
  "operating-rooms",
  "ventilators",
  "doctors",
  "nurses",
  "ambulances"
]);

export type ResourceType = z.infer<typeof resourceTypeSchema>;
