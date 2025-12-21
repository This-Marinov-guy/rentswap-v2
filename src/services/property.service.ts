interface PropertyData {
  city: string;
  address: string;
  postcode: string;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  size: string;
  period: string | { en: string; bg: string; gr: string };
  rent: string;
  bills: string | { en: string; bg: string; gr: string };
  flatmates: string | { en: string; bg: string; gr: string };
  registration: boolean;
  description: string | { en: string; bg: string; gr: string };
  title?: string | { en: string; bg: string; gr: string };
  folder?: string;
  images?: string;
  payment_link?: string | null;
}

export class PropertyService {
  modifyPropertyDataWithTranslations(data: PropertyData): PropertyData {
    const values = ['title', 'period', 'bills', 'flatmates', 'description'] as const;

    for (const key of values) {
      if (data[key as keyof PropertyData]) {
        const value = data[key as keyof PropertyData];
        if (typeof value === 'string') {
          // Create JSON object with en value and empty strings for other languages
          const translationObject = {
            en: value,
            bg: '',
            gr: '',
          };
          (data as unknown as Record<string, string | boolean | { en: string; bg: string; gr: string } | undefined>)[key] = translationObject;
        }
      } else if (key === 'title') {
        // Create JSON object with default title
        const translationObject = {
          en: 'Available room',
          bg: '',
          gr: '',
        };
        (data as unknown as Record<string, string | boolean | { en: string; bg: string; gr: string } | undefined>).title = translationObject;
      }
    }

    return data;
  }

  createFolderName(description: string): string {
    const descriptionText = description.substring(0, 10);
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    return `${descriptionText}|${timestamp}`;
  }
}

