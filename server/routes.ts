import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertPatientSchema, 
  insertDoctorSchema, 
  insertAppointmentSchema,
  insertMedicalRecordSchema,
  insertBillingSchema,
  insertHospitalResourceSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get('/api/dashboard/stats', async (req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
    }
  });

  // Hospital resources
  app.get('/api/resources', async (req: Request, res: Response) => {
    try {
      const resources = await storage.getAllHospitalResources();
      res.json(resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ message: 'Failed to fetch hospital resources' });
    }
  });

  app.get('/api/resources/:id', async (req: Request, res: Response) => {
    try {
      const resourceId = parseInt(req.params.id);
      const resource = await storage.getHospitalResource(resourceId);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }
      res.json(resource);
    } catch (error) {
      console.error('Error fetching resource:', error);
      res.status(500).json({ message: 'Failed to fetch hospital resource' });
    }
  });

  app.post('/api/resources', async (req: Request, res: Response) => {
    try {
      const resourceData = insertHospitalResourceSchema.parse(req.body);
      const resource = await storage.createHospitalResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid resource data', errors: error.errors });
      }
      console.error('Error creating resource:', error);
      res.status(500).json({ message: 'Failed to create hospital resource' });
    }
  });

  app.put('/api/resources/:id', async (req: Request, res: Response) => {
    try {
      const resourceId = parseInt(req.params.id);
      const resourceData = insertHospitalResourceSchema.partial().parse(req.body);
      const resource = await storage.updateHospitalResource(resourceId, resourceData);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }
      res.json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid resource data', errors: error.errors });
      }
      console.error('Error updating resource:', error);
      res.status(500).json({ message: 'Failed to update hospital resource' });
    }
  });

  // Patient routes
  app.get('/api/patients', async (req: Request, res: Response) => {
    try {
      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ message: 'Failed to fetch patients' });
    }
  });

  app.get('/api/patients/:id', async (req: Request, res: Response) => {
    try {
      const patientId = req.params.id;
      const patient = await storage.getPatientByPatientId(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ message: 'Failed to fetch patient details' });
    }
  });

  app.post('/api/patients', async (req: Request, res: Response) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid patient data', errors: error.errors });
      }
      console.error('Error creating patient:', error);
      res.status(500).json({ message: 'Failed to create patient' });
    }
  });

  app.put('/api/patients/:id', async (req: Request, res: Response) => {
    try {
      const patientId = req.params.id;
      const patientData = insertPatientSchema.partial().parse(req.body);
      const patient = await storage.updatePatient(patientId, patientData);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid patient data', errors: error.errors });
      }
      console.error('Error updating patient:', error);
      res.status(500).json({ message: 'Failed to update patient' });
    }
  });

  app.delete('/api/patients/:id', async (req: Request, res: Response) => {
    try {
      const patientId = req.params.id;
      const deleted = await storage.deletePatient(patientId);
      if (!deleted) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting patient:', error);
      res.status(500).json({ message: 'Failed to delete patient' });
    }
  });

  // Doctor routes
  app.get('/api/doctors', async (req: Request, res: Response) => {
    try {
      const doctors = await storage.getAllDoctors();
      res.json(doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      res.status(500).json({ message: 'Failed to fetch doctors' });
    }
  });

  app.get('/api/doctors/:id', async (req: Request, res: Response) => {
    try {
      const doctorId = req.params.id;
      const doctor = await storage.getDoctorByDoctorId(doctorId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      res.status(500).json({ message: 'Failed to fetch doctor details' });
    }
  });

  app.post('/api/doctors', async (req: Request, res: Response) => {
    try {
      const doctorData = insertDoctorSchema.parse(req.body);
      const doctor = await storage.createDoctor(doctorData);
      res.status(201).json(doctor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid doctor data', errors: error.errors });
      }
      console.error('Error creating doctor:', error);
      res.status(500).json({ message: 'Failed to create doctor' });
    }
  });

  app.put('/api/doctors/:id', async (req: Request, res: Response) => {
    try {
      const doctorId = req.params.id;
      const doctorData = insertDoctorSchema.partial().parse(req.body);
      const doctor = await storage.updateDoctor(doctorId, doctorData);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid doctor data', errors: error.errors });
      }
      console.error('Error updating doctor:', error);
      res.status(500).json({ message: 'Failed to update doctor' });
    }
  });

  app.delete('/api/doctors/:id', async (req: Request, res: Response) => {
    try {
      const doctorId = req.params.id;
      const deleted = await storage.deleteDoctor(doctorId);
      if (!deleted) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      res.status(500).json({ message: 'Failed to delete doctor' });
    }
  });

  // Appointment routes
  app.get('/api/appointments', async (req: Request, res: Response) => {
    try {
      const { date, patientId, doctorId } = req.query;
      
      let appointments;
      if (date) {
        appointments = await storage.getAppointmentsByDate(date as string);
      } else if (patientId) {
        appointments = await storage.getAppointmentsByPatientId(patientId as string);
      } else if (doctorId) {
        appointments = await storage.getAppointmentsByDoctorId(doctorId as string);
      } else {
        appointments = await storage.getAllAppointments();
      }
      
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Failed to fetch appointments' });
    }
  });

  app.get('/api/appointments/:id', async (req: Request, res: Response) => {
    try {
      const appointmentId = req.params.id;
      const appointment = await storage.getAppointmentByAppointmentId(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      res.status(500).json({ message: 'Failed to fetch appointment details' });
    }
  });

  app.post('/api/appointments', async (req: Request, res: Response) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid appointment data', errors: error.errors });
      }
      console.error('Error creating appointment:', error);
      res.status(500).json({ message: 'Failed to create appointment' });
    }
  });

  app.put('/api/appointments/:id', async (req: Request, res: Response) => {
    try {
      const appointmentId = req.params.id;
      const appointmentData = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(appointmentId, appointmentData);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid appointment data', errors: error.errors });
      }
      console.error('Error updating appointment:', error);
      res.status(500).json({ message: 'Failed to update appointment' });
    }
  });

  app.delete('/api/appointments/:id', async (req: Request, res: Response) => {
    try {
      const appointmentId = req.params.id;
      const deleted = await storage.deleteAppointment(appointmentId);
      if (!deleted) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ message: 'Failed to delete appointment' });
    }
  });

  // Medical Record routes
  app.get('/api/records', async (req: Request, res: Response) => {
    try {
      const { patientId } = req.query;
      
      let records;
      if (patientId) {
        records = await storage.getMedicalRecordsByPatientId(patientId as string);
      } else {
        records = await storage.getAllMedicalRecords();
      }
      
      res.json(records);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      res.status(500).json({ message: 'Failed to fetch medical records' });
    }
  });

  app.get('/api/records/:id', async (req: Request, res: Response) => {
    try {
      const recordId = req.params.id;
      const record = await storage.getMedicalRecordByRecordId(recordId);
      if (!record) {
        return res.status(404).json({ message: 'Medical record not found' });
      }
      res.json(record);
    } catch (error) {
      console.error('Error fetching medical record:', error);
      res.status(500).json({ message: 'Failed to fetch medical record details' });
    }
  });

  app.post('/api/records', async (req: Request, res: Response) => {
    try {
      const recordData = insertMedicalRecordSchema.parse(req.body);
      const record = await storage.createMedicalRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid medical record data', errors: error.errors });
      }
      console.error('Error creating medical record:', error);
      res.status(500).json({ message: 'Failed to create medical record' });
    }
  });

  app.put('/api/records/:id', async (req: Request, res: Response) => {
    try {
      const recordId = req.params.id;
      const recordData = insertMedicalRecordSchema.partial().parse(req.body);
      const record = await storage.updateMedicalRecord(recordId, recordData);
      if (!record) {
        return res.status(404).json({ message: 'Medical record not found' });
      }
      res.json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid medical record data', errors: error.errors });
      }
      console.error('Error updating medical record:', error);
      res.status(500).json({ message: 'Failed to update medical record' });
    }
  });

  app.delete('/api/records/:id', async (req: Request, res: Response) => {
    try {
      const recordId = req.params.id;
      const deleted = await storage.deleteMedicalRecord(recordId);
      if (!deleted) {
        return res.status(404).json({ message: 'Medical record not found' });
      }
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting medical record:', error);
      res.status(500).json({ message: 'Failed to delete medical record' });
    }
  });

  // Billing routes
  app.get('/api/billings', async (req: Request, res: Response) => {
    try {
      const { patientId } = req.query;
      
      let billings;
      if (patientId) {
        billings = await storage.getBillingsByPatientId(patientId as string);
      } else {
        billings = await storage.getAllBillings();
      }
      
      res.json(billings);
    } catch (error) {
      console.error('Error fetching billings:', error);
      res.status(500).json({ message: 'Failed to fetch billings' });
    }
  });

  app.get('/api/billings/:id', async (req: Request, res: Response) => {
    try {
      const billingId = req.params.id;
      const billing = await storage.getBillingByBillingId(billingId);
      if (!billing) {
        return res.status(404).json({ message: 'Billing not found' });
      }
      res.json(billing);
    } catch (error) {
      console.error('Error fetching billing:', error);
      res.status(500).json({ message: 'Failed to fetch billing details' });
    }
  });

  app.post('/api/billings', async (req: Request, res: Response) => {
    try {
      const billingData = insertBillingSchema.parse(req.body);
      const billing = await storage.createBilling(billingData);
      res.status(201).json(billing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid billing data', errors: error.errors });
      }
      console.error('Error creating billing:', error);
      res.status(500).json({ message: 'Failed to create billing' });
    }
  });

  app.put('/api/billings/:id', async (req: Request, res: Response) => {
    try {
      const billingId = req.params.id;
      const billingData = insertBillingSchema.partial().parse(req.body);
      const billing = await storage.updateBilling(billingId, billingData);
      if (!billing) {
        return res.status(404).json({ message: 'Billing not found' });
      }
      res.json(billing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid billing data', errors: error.errors });
      }
      console.error('Error updating billing:', error);
      res.status(500).json({ message: 'Failed to update billing' });
    }
  });

  app.delete('/api/billings/:id', async (req: Request, res: Response) => {
    try {
      const billingId = req.params.id;
      const deleted = await storage.deleteBilling(billingId);
      if (!deleted) {
        return res.status(404).json({ message: 'Billing not found' });
      }
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting billing:', error);
      res.status(500).json({ message: 'Failed to delete billing' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
