export interface SalePointDto {
  id: string;
  name: string;
  address: string;
  hotline: string;
  isActived: boolean;
  attachments: AttachmentsFile[];
  nameContact: string;
  phone: string;
  description: string;
  username: string;
  password: string;
}

export interface SalePointOutDto extends SalePointDto {
  tenantId: string | null;
}

export interface AttachmentsFile {
  url: string;
  name: string;
}
