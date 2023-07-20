import { I18n } from "i18n-js";
import { locale } from "expo-localization";

import en from "./en.json";
import fr from "./fr.json";

const i18n = new I18n({
  en: en,
  fr: fr,
});

i18n.locale = locale;
i18n.enableFallback = true;

export default i18n;
