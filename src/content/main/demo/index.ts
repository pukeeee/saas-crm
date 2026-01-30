export const demoContent = {
  info: {
    badge: "Запит на демо",
    title: "Подивіться Justio CRM у дії",
    description: "Отримайте персоналізовану демонстрацію, адаптовану під вашу спеціалізацію та розмір фірми. Наша команда покаже вам, як Justio CRM може оптимізувати ваші робочі процеси.",
    steps: [
      {
        number: "1",
        title: "Оберіть час",
        description: "Оберіть зручний для вас 30-хвилинний слот",
      },
      {
        number: "2",
        title: "Подивіться продукт",
        description: "Персоналізований огляд ключових функцій",
      },
      {
        number: "3",
        title: "Почніть тріал",
        description: "14 днів безкоштовно, кредитна картка не потрібна",
      },
    ],
  },
  form: {
    title: "Запитайте персональне демо",
    fields: {
      firstName: {
        label: "Ім'я",
        placeholder: "Олександр",
      },
      lastName: {
        label: "Прізвище",
        placeholder: "Коваленко",
      },
      email: {
        label: "Робочий Email",
        placeholder: "alex@lawfirm.com.ua",
      },
      company: {
        label: "Юридична фірма / Компанія",
        placeholder: "Коваленко та партнери",
      },
      size: {
        label: "Розмір фірми",
        placeholder: "Оберіть розмір фірми",
        options: [
          { value: "1", label: "Приватна практика (Solo)" },
          { value: "2-10", label: "2-10 юристів" },
          { value: "11-50", label: "11-50 юристів" },
          { value: "51-200", label: "51-200 юристів" },
          { value: "200+", label: "Понад 200 юристів" },
        ],
      },
    },
    submit: "Запитати демо",
    agreement: {
      text: "Надсилаючи запит, ви погоджуєтеся з нашими",
      terms: "Умовами",
      privacy: "Політикою конфіденційності",
    },
  },
};
