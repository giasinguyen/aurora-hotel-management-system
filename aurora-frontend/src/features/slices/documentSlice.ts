import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getAllDocuments, 
  getDocumentById,
  uploadDocument,
  updateDocument,
  updateDocumentMetadata,
  deleteDocument,
  removeChunking,
  reChunkDocument,
  reindexAllDocuments,
  isDocumentIndexed
} from '@/services/documentApi';
import type { DocumentResponse } from '@/types/document.types';

interface DocumentState {
  documents: DocumentResponse[];
  currentDocument: DocumentResponse | null;
  loading: boolean;
  uploadProgress: number;
  error: string | null;
}

const initialState: DocumentState = {
  documents: [],
  currentDocument: null,
  loading: false,
  uploadProgress: 0,
  error: null,
};

// Async thunks
export const fetchAllDocuments = createAsyncThunk(
  'document/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllDocuments();
      return response.result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchDocumentById = createAsyncThunk(
  'document/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getDocumentById(id);
      return response.result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const uploadNewDocument = createAsyncThunk(
  'document/upload',
  async ({ file, shouldEmbed = false, description }: { file: File; shouldEmbed?: boolean; description?: string }, { rejectWithValue }) => {
    try {
      const response = await uploadDocument(file, shouldEmbed, description);
      return response.result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateExistingDocument = createAsyncThunk(
  'document/update',
  async ({ id, file, shouldEmbed = false, description }: { id: string; file: File; shouldEmbed?: boolean; description?: string }, { rejectWithValue }) => {
    try {
      const response = await updateDocument(id, file, shouldEmbed, description);
      return response.result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateDocumentMetadataOnly = createAsyncThunk(
  'document/updateMetadata',
  async ({ id, description, shouldEmbed }: { id: string; description?: string; shouldEmbed?: boolean }, { rejectWithValue }) => {
    try {
      const response = await updateDocumentMetadata(id, description, shouldEmbed);
      return response.result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteDocumentById = createAsyncThunk(
  'document/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDocument(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeDocumentChunking = createAsyncThunk(
  'document/removeChunking',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await removeChunking(id);
      return response.result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const reChunkDocumentById = createAsyncThunk(
  'document/reChunk',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await reChunkDocument(id);
      return response.result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const reindexAll = createAsyncThunk(
  'document/reindexAll',
  async (_, { rejectWithValue }) => {
    try {
      await reindexAllDocuments();
      return true;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const checkIsIndexed = createAsyncThunk(
  'document/checkIsIndexed',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await isDocumentIndexed(id);
      return { id, isIndexed: response.result };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Slice
const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    clearCurrentDocument: (state) => {
      state.currentDocument = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all documents
    builder
      .addCase(fetchAllDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchAllDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch document by ID
    builder
      .addCase(fetchDocumentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDocument = action.payload;
      })
      .addCase(fetchDocumentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Upload document
    builder
      .addCase(uploadNewDocument.pending, (state) => {
        state.loading = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadNewDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadProgress = 100;
        state.documents.push(action.payload);
      })
      .addCase(uploadNewDocument.rejected, (state, action) => {
        state.loading = false;
        state.uploadProgress = 0;
        state.error = action.payload as string;
      });

    // Update document
    builder
      .addCase(updateExistingDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingDocument.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.documents.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      })
      .addCase(updateExistingDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update document metadata only
    builder
      .addCase(updateDocumentMetadataOnly.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDocumentMetadataOnly.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.documents.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      })
      .addCase(updateDocumentMetadataOnly.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete document
    builder
      .addCase(deleteDocumentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocumentById.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = state.documents.filter(doc => doc.id !== action.payload);
        if (state.currentDocument?.id === action.payload) {
          state.currentDocument = null;
        }
      })
      .addCase(deleteDocumentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Remove chunking
    builder
      .addCase(removeDocumentChunking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeDocumentChunking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.documents.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
      })
      .addCase(removeDocumentChunking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Re-chunk document
    builder
      .addCase(reChunkDocumentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reChunkDocumentById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.documents.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
      })
      .addCase(reChunkDocumentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Reindex all
    builder
      .addCase(reindexAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reindexAll.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(reindexAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentDocument, clearError, setUploadProgress } = documentSlice.actions;
export default documentSlice.reducer;
