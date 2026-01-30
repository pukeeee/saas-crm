export const contactContent = {
  hero: {
    badge: "Контакти",
    title: "Зв'яжіться з нами",
    description: "Маєте запитання про Justio CRM? Бажаєте запланувати персональне демо? Ми завжди раді допомогти та вислухати вас.",
  },
  methods: {
    items: [
      {
        icon: "Mail",
        title: "Email",
        description: "Напишіть нам у будь-який час",
        value: "hello@justio.com.ua",
      },
      {
        icon: "MessageSquare",
        title: "Онлайн-чат",
        description: "Пн-Пт, з 9:00 до 18:00",
        value: "Почати діалог",
      },
      {
        icon: "Phone",
        title: "Телефон",
        description: "Для консультацій",
        value: "+380 (44) 123-45-67",
      },
    ],
  },
  form: {
    title: "Надішліть нам повідомлення",
    description: "Заповніть форму нижче, і ми відповімо вам протягом 24 годин.",
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
        label: "Email",
        placeholder: "alex@lawfirm.com.ua",
      },
      company: {
        label: "Юридична фірма / Компанія",
        placeholder: "Коваленко та партнери",
      },
      message: {
        label: "Повідомлення",
        placeholder: "Розкажіть, чим ми можемо допомогти...",
      },
    },
    submit: "Надіслати повідомлення",
  },
};
