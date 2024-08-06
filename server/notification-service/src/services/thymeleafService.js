exports.createContent = (templateContent, variables) => {
  console.log('Template content:', templateContent);
  console.log('Variables:', variables);
  const template = Handlebars.compile(templateContent);
  const result = template(variables);
  console.log('Rendered result:', result);
  return result;
};