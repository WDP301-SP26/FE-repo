import { http, HttpResponse } from 'msw';
import { getGroupsByLecturer, mockGroups } from '../data/groups';

export const groupHandlers = [
  // Get all groups (can be filtered by lecturer via query param or auth context in real app)
  http.get('/api/groups', ({ request }) => {
    const url = new URL(request.url);
    const lecturerId = url.searchParams.get('lecturer_id');

    if (lecturerId) {
      return HttpResponse.json(getGroupsByLecturer(lecturerId));
    }

    // Default return all for now if no filter applied
    return HttpResponse.json(mockGroups);
  }),

  // Get single group
  http.get('/api/groups/:id', ({ params }) => {
    const { id } = params;
    const group = mockGroups.find((g) => g.id === id);

    if (!group) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(group);
  }),
];
