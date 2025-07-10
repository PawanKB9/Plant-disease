import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Need of updating address also controler/router/endpoint// feature
export const AppApi = createApi({
  reducerPath: "AppApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:5000`,
  }),
  endpoints: (builder) => ({

    // 1. send file for processing
    // uploadFile: builder.mutation({
    //   query: (formData) => ({
    //     url: '/upload-file',
    //     method: 'POST',
    //     body: {formData},
    //   }),
    // }),
    uploadFile: builder.mutation({
        query: (formData) => ({
            url: '/upload-file',
            method: 'POST',
            body: formData,
        }),
    }),



    // test
    testing: builder.mutation({
      query: ({message}) => ({
        url: '/test',
        method: 'POST',
        body: {message},
      }),
    }),

    // 2. get details

  }),
});

export const {
  useUploadFileMutation,
  useTestingMutation,
} = AppApi