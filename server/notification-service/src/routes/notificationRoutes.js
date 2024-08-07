const express = require('express');
const router = express.Router();
const emailSenderController = require('../controllers/emailSenderController');
const emailTemplateController = require('../controllers/emailTemplateController');
const notificationController = require('../controllers/notificationController');

/**
 * @swagger
 * components:
 *   schemas:
 *     EmailTemplate:
 *       type: object
 *       required:
 *         - category
 *         - name
 *         - subject
 *         - content
 *       properties:
 *         category:
 *           type: string
 *         name:
 *           type: string
 *         subject:
 *           type: string
 *         content:
 *           type: string
 *         defaultTemplate:
 *           type: boolean
 *         version:
 *           type: number
 *     
 *     Notification:
 *       type: object
 *       required:
 *         - email
 *         - templateName
 *         - sent
 *       properties:
 *         email:
 *           type: string
 *         templateName:
 *           type: string
 *         exception:
 *           type: string
 *         createdDate:
 *           type: string
 *           format: date-time
 *         sent:
 *           type: boolean
 */

/**
 * @swagger
 * /send-email:
 *   post:
 *     summary: Send an email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toEmail
 *               - templateCategory
 *               - variables
 *             properties:
 *               toEmail:
 *                 type: string
 *               templateCategory:
 *                 type: string
 *               variables:
 *                 type: object
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       500:
 *         description: Server error
 */
router.post('/send-email', emailSenderController.sendEmail);

/**
 * @swagger
 * /send-bulk-email:
 *   post:
 *     summary: Send bulk emails
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toEmails
 *               - templateCategory
 *               - variables
 *             properties:
 *               toEmails:
 *                 type: array
 *                 items:
 *                   type: string
 *               templateCategory:
 *                 type: string
 *               variables:
 *                 type: object
 *     responses:
 *       200:
 *         description: Bulk emails sent successfully
 *       500:
 *         description: Server error
 */
router.post('/send-bulk-email', emailSenderController.sendBulkEmail);

/**
 * @swagger
 * /templates/{name}:
 *   get:
 *     summary: Get an email template by name
 *     tags: [Email Templates]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email template retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailTemplate'
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 */
router.get('/templates/:name', emailTemplateController.getTemplateByName);

/**
 * @swagger
 * /templates:
 *   post:
 *     summary: Save a new email template
 *     tags: [Email Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailTemplate'
 *     responses:
 *       201:
 *         description: Email template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailTemplate'
 *       500:
 *         description: Server error
 */
router.post('/templates', emailTemplateController.saveTemplate);

/**
 * @swagger
 * /templates/{id}:
 *   put:
 *     summary: Update an existing email template
 *     tags: [Email Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailTemplate'
 *     responses:
 *       200:
 *         description: Email template updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmailTemplate'
 *       500:
 *         description: Server error
 */
router.put('/templates/:id', emailTemplateController.updateTemplate);

/**
 * @swagger
 * /templates:
 *   get:
 *     summary: Get all email templates
 *     tags: [Email Templates]
 *     responses:
 *       200:
 *         description: List of all email templates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EmailTemplate'
 *       500:
 *         description: Server error
 */
router.get('/templates', emailTemplateController.getAllTemplates);

/**
 * @swagger
 * /notifications/email/{email}:
 *   get:
 *     summary: Get notifications by email
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notifications for the given email
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 */
router.get('/notifications/email/:email', notificationController.getNotificationsByEmail);

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     summary: Update notification status
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sent
 *             properties:
 *               sent:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notification status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 */
router.put('/notifications/:id', notificationController.updateNotificationStatus);

module.exports = router;