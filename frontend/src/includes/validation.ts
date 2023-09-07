import { Form as VeeForm, Field as VeeField, ErrorMessage, defineRule, configure } from 'vee-validate';
import { required, min, min_value, max, max_value, email, confirmed, alpha_spaces } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import en from '@vee-validate/i18n/dist/locale/en.json';
import pt_BR from '@vee-validate/i18n/dist/locale/pt_BR.json';
import ja from '@vee-validate/i18n/dist/locale/ja.json';

export default {
  // plug-ins are objects with a method called install
  // Vue wil call the install method when we register it
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    // name of the rule + function that will perform the validation; 
    // this rules will be available to every validation form
    defineRule('required', required);
    defineRule('min', min); 
    defineRule('max', max);
    defineRule('min_value', min_value); // must be a numeric value
    defineRule('max_value', max_value); // must be a numeric value
    defineRule('email', email); // must have the same value as the confirmation field.
    defineRule('passwords_mismatch', confirmed);
    defineRule('alpha_spaces', alpha_spaces);

    configure({
      generateMessage: localize({
        en: { 
          messages: {
            required: 'The field {field} is required',
            min: 'The field {field} must be at least 0:{min} characters.',
            max: 'The field {field} must be less than 0:{max}',
            alpha_spaces: 'The field {field} may only contain alphabetical characters and spaces.',
            email: 'The field {field} must be a valid email.',
            min_value: 'The field {field} is too low, at least 0:{min_value} or above.',
            max_value: 'The field {field} is too high, must be less than 0:{max_value}.',
            passwords_mismatch: 'The passwords don\'t match.'
          }
        },
        pt_BR: {
          messages: {
            required: 'O campo {field} é de obrigatório preenchimento.',
            min: 'O campo {field} deve ser pelo menos 0:{min} caracteres.',
            max: 'O campo {field} deve ser menor do que 0:{max}',
            alpha_spaces: 'O campo {field} deve apenas conter caracteres alfabéticos e espaços.',
            email: 'O campo {field} deve ser um válido email.',
            min_value: 'O valor do campo {field} está muito baixo, preencha com no mínimo 0:{min_value} ou acima.',
            max_value: 'O valor do campo {field} está muito alto, preencha no máximo ao 0:{min_value}.',
            passwords_mismatch: 'As senhas não são iguais.'
          }
        },
        ja,
      }),
      // validation triggers to change default behaviour: default values
      validateOnBlur: true,
      validateOnChange: true,  
      validateOnInput: false,
      validateOnModelUpdate: true, // validate when value changes internally through the v-model directive
    })
  },
}