import { SharePermission } from "@prisma/client";

export interface CreateListRequest {
  title: string;
  description?: string;
  color?: string;
}

export interface UpdateListRequest {
  title?: string;
  description?: string;
  color?: string;
}

export interface ShareListRequest {
  userId: string;
  permission: SharePermission;
}

export interface ListResponse {
  id: string;
  title: string;
  description?: string;
  color: string;
  isArchived: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    tasks: number;
    shares: number;
  };
}
