import { z } from 'zod';

export const requiredSearchParams = z.object({
    client_id: z.string(),
    redirect_uri: z.string(),
    state: z.string().optional(),
});
