export type Permission = "READ" | "WRITE" | "OWNER";

export interface TaskList {
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
    shares?: number;
  };
  permission: Permission;
  shares?: ListShare[];
}

export interface ListShare {
  id: string;
  userId: string;
  permission: Exclude<Permission, "OWNER">;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

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
  userId?: string;
  email?: string;
  permission: Exclude<Permission, "OWNER">;
}

export interface ListsResponse {
  success: boolean;
  data: TaskList[];
}

export interface ListResponse {
  success: boolean;
  data: TaskList;
}

export interface ListContextType {
  lists: TaskList[];
  currentList: TaskList | null;
  isLoading: boolean;
  fetchLists: () => Promise<void>;
  fetchList: (id: string) => Promise<void>;
  createList: (data: CreateListRequest) => Promise<TaskList>;
  updateList: (id: string, data: UpdateListRequest) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  shareList: (listId: string, data: ShareListRequest) => Promise<void>;
  removeShare: (listId: string, userId: string) => Promise<void>;
}
