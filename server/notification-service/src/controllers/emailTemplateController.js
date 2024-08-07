const emailTemplateService = require('../services/emailTemplateService');

exports.getTemplateByName = async (req, res) => {
  try {
    const template = await emailTemplateService.getTemplateByName(req.params.name);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.saveTemplate = async (req, res) => {
  try {
    const savedTemplate = await emailTemplateService.saveTemplate(req.body);
    res.status(201).json(savedTemplate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const updatedTemplate = await emailTemplateService.updateTemplate(req.params.id, req.body);
    res.json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await emailTemplateService.getAllTemplates();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};