import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPublicNews, getPublicNewsBySlug } from '@/services/newsApi';
import type { NewsListResponse, NewsDetailResponse } from '@/types/news.types';

interface NewsState {
  newsList: NewsListResponse[];
  currentNews: NewsDetailResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  newsList: [],
  currentNews: null,
  loading: false,
  error: null,
};

// Async thunks
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
      });
  },
});

export const { clearCurrentNews, clearError } = newsSlice.actions;
export default newsSlice.reducer;
