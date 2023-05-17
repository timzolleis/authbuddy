import axios from 'axios';
import { UnsplashImage } from '~/types/unsplash/unsplash-image';
import { environmentVariables } from '~/utils/env.server';

function getUnsplashClient() {
    const baseURL = 'https://api.unsplash.com';
    return axios.create({
        baseURL,
        headers: {
            Authorization: `Client-ID ${environmentVariables.UNSPLASH_ACCESS_KEY}`,
        },
    });
}

export async function getRandomPhoto() {
    const client = getUnsplashClient();
    const photo = await client
        .get<UnsplashImage>('/photos/random', {
            params: {
                query: 'mountain',
            },
        })
        .then((res) => res.data);
    return {
        url: photo.urls.regular,
        authorName: photo.user.name,
        authorUrl: photo.user.links.html,
        platformName: 'Unsplash',
        platformUrl: 'https://unsplash.com',
    };
}
