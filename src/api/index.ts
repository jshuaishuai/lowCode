import request from '@/utils/request';

export const login = (data: any) => request.post('/api/login.json', { data });
