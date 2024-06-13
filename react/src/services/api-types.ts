export interface RegisterData {
  username: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tagIds?: string[];
  directoryId?: string;
}

export interface UpdateNoteData extends Partial<CreateNoteData> {}

export interface CreateDirectoryData {
  title: string;
  color: string;
}

export interface UpdateDirectoryData extends Partial<CreateDirectoryData> {}