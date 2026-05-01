const Yup = require('yup');

const ValidationSchema = Yup.object().shape({
  ocr1Enabled: Yup.boolean(),
  ocr1IsBootstrap: Yup.boolean(),
  ocr1P2PPeerID: Yup.string()
    .when(['ocr1Enabled', 'ocr1IsBootstrap'], {
      is: (enabled, isBootstrap) => {
        console.log('Checking when condition:', {enabled, isBootstrap, shouldRequire: enabled && !isBootstrap});
        return enabled && !isBootstrap;
      },
      then: Yup.string().required('Required').nullable(),
    })
    .nullable(),
});

(async () => {
  try {
    const data = {
      ocr1Enabled: true,
      ocr1IsBootstrap: false,
      ocr1P2PPeerID: '',
    };
    console.log('Validating data:', JSON.stringify(data));
    await ValidationSchema.validate(data);
    console.log('Validation passed - NO ERROR');
  } catch (err) {
    console.log('Validation error:', err.message);
    console.log('Error path:', err.path);
  }
})();

