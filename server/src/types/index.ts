export interface DynamicFieldOption {
  id: string;
  value: string;
  label: string;
  category: string; 
  order: number;
  isActive: boolean;
}

export interface DynamicField {
  name: string;
  label: string;
  type: 'select' | 'multiselect' | 'text' | 'number' | 'radio' | 'checkbox';
  category: string;
  options: DynamicFieldOption[];
  isRequired: boolean;
  placeholder?: string;
}