import { http, HttpResponse } from 'msw';

import { API_BASE_URL } from '../../src/constants';

export const handlers = [
  http.get(API_BASE_URL + '/v2/videos', () =>
    HttpResponse.json({
      data: [
        {
          video_id: 'test_value_1',
          video_name: 'test_value',
          status: 'ready',
          data: {
            script: 'test_value',
          },
          download_url: 'test_value',
          hosted_url: 'test_value',
          stream_url: 'test_value',
          status_details: 'test_value',
          created_at: 'test_value',
          updated_at: 'test_value',
          still_image_thumbnail_url: 'test_value',
          gif_thumbnail_url: 'test_value',
        },
        {
          video_id: 'test_value_2',
          video_name: 'test_value',
          status: 'ready',
          data: {
            script: 'test_value',
          },
          download_url: 'test_value',
          hosted_url: 'test_value',
          stream_url: 'test_value',
          status_details: 'test_value',
          created_at: 'test_value',
          updated_at: 'test_value',
          still_image_thumbnail_url: 'test_value',
          gif_thumbnail_url: 'test_value',
        },
      ],
      total_count: 40,
    }),
  ),
  http.get(API_BASE_URL + '/v2/videos/:id', ({ params }) =>
    HttpResponse.json({
      video_id: params.id,
      video_name: 'test_value',
      status: 'ready',
      data: {
        script: 'test_value',
      },
      download_url: 'test_value',
      hosted_url: 'test_value',
      stream_url: 'test_value',
      status_details: 'test_value',
      created_at: 'test_value',
      updated_at: 'test_value',
    }),
  ),
];
