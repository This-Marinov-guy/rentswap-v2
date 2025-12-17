interface PropertyData {
  city: string;
  address: string;
  postcode: string;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  size: string;
  period: string;
  rent: string;
  bills: string;
  flatmates: string;
  registration: boolean;
  description: string;
  title?: string;
  folder?: string;
  images?: string;
  payment_link?: string | null;
}

export class PropertyService {
  private getDefaultLocalesObject(): Record<string, string> {
    const languages = ['en', 'nl', 'de', 'fr', 'es', 'it', 'pt', 'pl'];
    return Object.fromEntries(languages.map(lang => [lang, '']));
  }

  modifyPropertyDataWithTranslations(data: PropertyData): PropertyData {
    const defaultTranslations = this.getDefaultLocalesObject();
    const values = ['title', 'period', 'bills', 'flatmates', 'description'];

    for (const key of values) {
      if (data[key as keyof PropertyData]) {
        const value = data[key as keyof PropertyData];
        if (typeof value === 'string') {
          (data as any)[key] = JSON.stringify({
            ...defaultTranslations,
            en: value,
          });
        }
      } else if (key === 'title') {
        (data as any).title = JSON.stringify({
          ...defaultTranslations,
          en: 'Available room',
        });
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

