// Permission Management Types
export interface Permission {
  name: string;
  description: string;
  category: string;
  isSystemPermission: boolean;
  createdAt: string;
  updatedAt?: string;
}