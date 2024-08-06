const EmailTemplate = require('../models/emailTemplate');

exports.getTemplateByName = async (name) => {
  return EmailTemplate.findOne({ name });
};

exports.saveTemplate = async (template) => {
  return EmailTemplate.create(template);
};

exports.getAllTemplates = async () => {
  return EmailTemplate.find();
};

exports.updateTemplate = async (id, updatedTemplate) => {
  return EmailTemplate.findByIdAndUpdate(id, updatedTemplate, { new: true });
};

exports.deleteTemplate = async (id) => {
  return EmailTemplate.findByIdAndDelete(id);
};

exports.findDefaultTemplateByCategory = async (category) => {
  return EmailTemplate.findOne({ category, defaultTemplate: true }).sort('-version');
};