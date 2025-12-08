import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getAllNews, 
  getPublicNews, 
  getPublicNewsBySlug,
  updateNewsVisibility,
  deleteNews
} from '@/services/newsApi';
import type { 
  NewsListResponse, 
  NewsDetailResponse,
  NewsVisibilityRequest 
} from '@/types/news.types';

interface NewsState {
  allNewsList: NewsListResponse[];
  newsList: NewsListResponse[];
  currentNews: NewsDetailResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  allNewsList: [],
  newsList: [],
  currentNews: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllNews = createAsyncThunk(
  'news/fetchAllNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllNews();
      return response.result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchPublicNews = createAsyncThunk(
  'news/fetchPublicNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPublicNews();
      return response.result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchPublicNewsBySlug = createAsyncThunk(
  'news/fetchPublicNewsBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await getPublicNewsBySlug(slug);
      return response.result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateVisibility = createAsyncThunk(
  'news/updateVisibility',
  async ({ id, request }: { id: string; request: NewsVisibilityRequest }, { rejectWithValue }) => {
    try {
      const response = await updateNewsVisibility(id, request);
      return response.result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteNewsById = createAsyncThunk(
  'news/deleteNewsById',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteNews(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    clearCurrentNews: (state) => {
      state.currentNews = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all news
      .addCase(fetchAllNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNews.fulfilled, (state, action) => {
        state.loading = false;
        state.allNewsList = action.payload;
      })
      .addCase(fetchAllNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch public news
      .addCase(fetchPublicNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicNews.fulfilled, (state, action) => {
        state.loading = false;
        state.newsList = action.payload;
      })
      .addCase(fetchPublicNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch public news by slug
      .addCase(fetchPublicNewsBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicNewsBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNews = action.payload;
      })
      .addCase(fetchPublicNewsBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update visibility
      .addCase(updateVisibility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVisibility.fulfilled, (state, action) => {
        state.loading = false;
        // Update in allNewsList
        const index = state.allNewsList.findIndex(news => news.id === action.payload.id);
        if (index !== -1) {
          state.allNewsList[index] = action.payload;
        }
        // Update in newsList if exists
        const publicIndex = state.newsList.findIndex(news => news.id === action.payload.id);
        if (publicIndex !== -1) {
          if (action.payload.isPublic) {
            state.newsList[publicIndex] = action.payload;
          } else {
            // Remove from public list if made private
            state.newsList.splice(publicIndex, 1);
          }
        } else if (action.payload.isPublic) {
          // Add to public list if made public
          state.newsList.push(action.payload);
        }
      })
      .addCase(updateVisibility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete news
      .addCase(deleteNewsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNewsById.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from allNewsList
        state.allNewsList = state.allNewsList.filter(news => news.id !== action.payload);
        // Remove from newsList
        state.newsList = state.newsList.filter(news => news.id !== action.payload);
      })
      .addCase(deleteNewsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentNews, clearError } = newsSlice.actions;
export default newsSlice.reducer;
