export interface SalePointDto {
    id: string;
    name: string;
    address: string;
    hotline: string;
    status: boolean;
    attachments: AttachmentsFile[];
    nameContact: string;
    phone: string;
    description: string;
}

export interface SalePointOutDto extends SalePointDto {
    tenantId: string | null;
}

export interface AttachmentsFile {
    url: string;
    file?: any;
}