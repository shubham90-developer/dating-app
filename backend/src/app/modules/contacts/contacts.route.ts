import express from "express";
import {
  createContact,
  deleteContact,
  getAllContactData,
  getContactById,
  updateContact,
} from "./contacts.controller";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         _id: { type: string, example: 64f1a2b3c4d5e6f7a8b9c0d1 }
 *         fullName: { type: string, example: "Jane Smith" }
 *         emailAddress: { type: string, format: email, example: "jane.smith@example.com" }
 *         phone: { type: string, example: "9876543210" }
 *         subject: { type: string, example: "Query about subscription plans" }
 *         message: { type: string, example: "Hi, I'd like to know more about your premium plan pricing." }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *     ContactRequest:
 *       type: object
 *       properties:
 *         fullName: { type: string, example: "Jane Smith" }
 *         emailAddress: { type: string, format: email, example: "jane.smith@example.com" }
 *         phone: { type: string, example: "9876543210" }
 *         subject: { type: string, example: "Query about subscription plans" }
 *         message: { type: string, example: "Hi, I'd like to know more about your premium plan pricing." }
 *     ContactSuccessResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         statusCode: { type: integer, example: 200 }
 *         message: { type: string, example: "Contact retrieved successfully" }
 *         data: { $ref: '#/components/schemas/Contact' }
 *     ContactListResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         statusCode: { type: integer, example: 200 }
 *         message: { type: string, example: "Contact retrieved successfully" }
 *         data:
 *           type: array
 *           items: { $ref: '#/components/schemas/Contact' }
 *     ContactErrorResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: false }
 *         statusCode: { type: integer, example: 400 }
 *         message: { type: string, example: "Contact already exists" }
 */

/**
 * @swagger
 * /v1/api/contacts:
 *   post:
 *     summary: Submit a contact form
 *     description: |
 *       Creates a new contact/enquiry entry, typically submitted from the website's "Contact Us" form.
 *       A duplicate submission with the exact same fullName, emailAddress, subject, message and phone is rejected.
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactRequest'
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactSuccessResponse' }
 *       400:
 *         description: Contact already exists / validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactErrorResponse' }
 *   get:
 *     summary: Get all contact submissions
 *     description: Returns all contact form submissions, sorted by most recently created first.
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactListResponse' }
 */
router.post("/", createContact);

router.get("/", getAllContactData);

/**
 * @swagger
 * /v1/api/contacts/{id}:
 *   get:
 *     summary: Get contact submission by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Contact ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactSuccessResponse' }
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactErrorResponse' }
 *   put:
 *     summary: Update contact submission
 *     description: Partially updates a contact entry. Any field omitted keeps its previous value.
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Contact ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactRequest'
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactSuccessResponse' }
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactErrorResponse' }
 *   delete:
 *     summary: Delete contact submission
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Contact ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactSuccessResponse' }
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ContactErrorResponse' }
 */
router.get("/:id", getContactById);

router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export const contactRouter = router;
