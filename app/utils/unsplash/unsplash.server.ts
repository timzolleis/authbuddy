import * as process from 'process';
import { EnvRequiredException } from '~/exception/EnvRequiredException';
import axios from 'axios';
import { UnsplashImage } from '~/types/unsplash/unsplash-image';

function getUnsplashClient() {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
        throw new EnvRequiredException('UNSPLASH_ACCESS_KEY');
    }
    const baseURL = 'https://api.unsplash.com';
    return axios.create({
        baseURL,
        headers: {
            Authorization: `Client-ID ${accessKey}`,
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
